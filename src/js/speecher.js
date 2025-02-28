import PCMPlayer from "@/js/PCMPlayer.js";

class LASSTT {
    /*
    sampleRate: 采样率
    bufferSize: 缓冲区大小
    pcmTimerPeriod: PCM数据保存周期
    waveTimerPeriod: 波形数据保存周期
    speechThreshold: 设置声音阈值
    silenceDuration: 设置静音时长阈值（毫秒）
    */
    constructor(sampleRate = 44100, bufferSize = 2048, pcmTimerPeriod = 3000, waveTimerPeriod = 300, speechThreshold = 128, silenceDuration = 0) {
        this.audioContext = null;
        this.audioStream = null;
        this.bufferSize = bufferSize;
        this.scriptNode = null;
        this.analyser = null;
        this.pcmTimer = null;
        this.silenceTimer = null;
        this.waveTimer = null;
        this.sampleRate = sampleRate;
        this.pcmTimerPeriod = pcmTimerPeriod;
        this.waveTimerPeriod = waveTimerPeriod;
        this.speechThreshold = speechThreshold;
        this.silenceDuration = silenceDuration;
        this.proxyObj = this.proxyInit();
        this.eventSource = null;
        this.eventListeners = {};
    }

    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((callback) => {
                callback(data);
            });
        }
    }

    proxyInit() {
        let t = {};
        let self = this;
        return new Proxy(t, {
            set(target, key, value) {
                target[key] = value;
                self.emit(`${key}-change`, {
                    key: key,
                    value: value
                });
                return true;
            },
            get(target, key) {
                return target[key];
            }
        });
    }

    start() {
        if (this.proxyObj.lock === false) return;
        this.proxyObj.lock = false;
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then((stream) => {
                this.proxyObj.lock = true;
                this.proxyObj.active = true;
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: this.sampleRate
                });
                this.scriptNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1)
                this.analyser = this.audioContext.createAnalyser()
                this.audioStream = stream;
                let source =
                    this.audioContext.createMediaStreamSource(stream);
                source.connect(this.analyser);
                this.analyser.fftSize = this.bufferSize;
                let bufferLength = this.analyser.fftSize;
                let dataArray = new Uint8Array(bufferLength);
                let draw = () => {
                    this.waveTimer = setTimeout(() => {
                        draw();
                    }, this.waveTimerPeriod);
                    this.analyser.getByteTimeDomainData(dataArray);
                    this.emit('wave-capture', {
                        dataArray,
                        bufferLength
                    });
                };
                draw();

                source.connect(this.scriptNode);
                this.scriptNode.connect(this.audioContext.destination);
                let chunks = [];
                this.scriptNode.onaudioprocess = (event) => {
                    let inputData = event.inputBuffer.getChannelData(0);
                    chunks.push(inputData.slice(0)); // 将数据存入数组
                    this.silenceStop(inputData, this.speechThreshold, this.silenceDuration); // 静音检测
                };

                // 每3秒保存一次PCM数据
                this.pcmTimer = setInterval(async () => {
                    if (chunks.length > 0) {
                        let pcmData = this.mergeBuffers(chunks); // 将所有缓冲区数据合并
                        let pcm16Data = this.floatTo16BitPCM(pcmData); // 将浮点数转换为16位PCM数据
                        let pcmBlob = new Blob([pcmData], {
                            type: 'audio/pcm'
                        }); // 创建Blob对象
                        let pcm16Blob = new Blob([pcm16Data], {
                            type: 'audio/pcm'
                        }); // 创建Blob对象
                        // let pcmBase64 = await this.blobToBase64(pcmBlob); // 将Blob对象转换为Base64字符串
                        let pcm16Base64 = await this.blobToBase64(pcm16Blob); // 将Blob对象转换为Base64字符串
                        this.emit('pcm-capture', {
                            pcmBlob: pcmBlob,
                            pcm16Blob: pcm16Blob,
                            pcmData: pcmData,
                            pcm16Data: pcm16Data,
                            // pcmBase64: pcmBase64,
                            pcm16Base64: pcm16Base64
                        });
                        chunks = []; // 清空缓冲区
                    }
                }, this.pcmTimerPeriod);
            })
            .catch((err) => {
                /* 处理 error */
                console.error(err);
                this.proxyObj.lock = true;
                this.proxyObj.active = false;
                this.emit('error', {
                    error: err
                });
            });
    }

    // 合并缓冲区数据
    mergeBuffers(chunks) {
        let length = chunks.reduce(
            (acc, chunk) => acc + chunk.length,
            0
        );
        let merged = new Float32Array(length);
        let offset = 0;
        chunks.forEach((chunk) => {
            merged.set(chunk, offset);
            offset += chunk.length;
        });
        return merged;
    }

    // 将浮点数转换为16位PCM数据
    floatTo16BitPCM(input) {
        let output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                let base64String = reader.result.split(',')[1]; // 获取Base64字符串部分
                resolve(base64String);
            };
            reader.onerror = () => {
                reject(new Error('Failed to read the Blob as Base64'));
            };
            reader.readAsDataURL(blob); // 将Blob对象读取为Data URL
        });
    }

    silenceStop(inputData, speechThreshold, silenceDuration) {
        if (silenceDuration === 0) {
            clearTimeout(this.silenceTimer);
            return;
        }
        let sum = inputData.reduce((acc, val) => acc + Math.abs(val), 0);
        let avg = sum / inputData.length;
        if (avg > speechThreshold) {
            // 如果声音强度高于阈值，重置静音计时器
            clearTimeout(this.silenceTimer);
        } else {
            // 如果声音强度低于阈值，启动静音计时器
            this.silenceTimer = setTimeout(() => {
                this.stopSpeech();
                this.emit('silence-end', {});
            }, silenceDuration);
        }
    }

    stopSpeech() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach((track) => track.stop());
        }
        // 停止 ScriptProcessorNode
        if (this.scriptNode) {
            this.scriptNode.disconnect();
        }
        // 清除定时器
        if (this.pcmTimer) {
            clearInterval(this.pcmTimer);
        }
        // 关闭音频上下文
        if (this.audioContext) {
            this.audioContext.close().catch((err) => {

            });
        }
        this.proxyObj.active = false;
    }

    sttStart($server) {
        if (this.proxyObj.sttId) {
            return;
        }
        let token = localStorage.getItem('ApiToken');
        if (!token) return;
        token = token.replace('Bearer ', '');
        if (this.eventSource) this.eventSource.close();
        this.eventSource = new EventSource(
            `${$server}/voice/stt?Authorization=${token}`
        );
        this.eventSource.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            if (data.code === 0) {
                let msgData = data.data;
                if (msgData.type === 'ID') {
                    this.proxyObj.sttId = msgData.data;
                }
                else if (msgData.type === 'TEXT') {
                    if (this.proxyObj.sttText)
                        this.proxyObj.sttText += msgData.data;
                    else
                        this.proxyObj.sttText = msgData.data;
                }
                else if (msgData.type === 'CLOSE') {
                    this.eventSource.close();
                    this.stopSpeech();
                    this.proxyObj.sttId = null;
                    this.proxyObj.sttText = null;
                }
            }
            else {
                this.eventSource.close();
                this.proxyObj.sttId = null;
                this.proxyObj.sttText = null;
            }
        });
        this.eventSource.addEventListener('error', (error) => {
            // console.log(error);
            this.eventSource.close();
            this.proxyObj.sttId = null;
        });
    }
}

class LASTTS {
    constructor(waveTimerPeriod = 60) {
        this.player = null;
        this.waveTimerPeriod = waveTimerPeriod;
        this.proxyObj = this.proxyInit();
        this.eventSource = null;
        this.eventListeners = {};
        this.waveTimer = null;
        this.destroyTimer = null;
    }

    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((callback) => {
                callback(data);
            });
        }
    }

    proxyInit() {
        let t = {};
        let self = this;
        return new Proxy(t, {
            set(target, key, value) {
                target[key] = value;
                self.emit(`${key}-change`, {
                    key: key,
                    value: value
                });
                return true;
            },
            get(target, key) {
                return target[key];
            }
        });
    }

    base64ToBlob(base64) {
        try {
            if (base64.split(',').length === 1) {
                base64 = 'data:audio/pcm;base64,' + base64;
            }
            let byteString = atob(base64.split(',')[1]);
            let mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            let ab = new ArrayBuffer(byteString.length);
            let ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {
                type: mimeString
            });
        }
        catch (e) {
            console.error(base64);
            return null;
        }
    }

    blobToBuffer(blob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject(new Error('Failed to read the Blob as ArrayBuffer'));
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    play(pcmBuffer) {
        if (!this.player || !this.player.audioCtx) {
            this.player = new PCMPlayer({
                inputCodec: 'Int16',
                channels: 1,
                sampleRate: 16000,
                flushTime: 1000,
                onstatechange: (node, event, type) => {
                    this.analyzePlayer();
                    this.proxyObj.active = true;
                    this.player.feed(pcmBuffer);
                },
                onended: () => {

                }
            });
        }
        else this.player.feed(pcmBuffer);
    }

    analyzePlayer() {
        let analyser = this.player.analyser;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        // 在播放过程中监测波形
        let draw = () => {
            this.waveTimer = setTimeout(() => {
                draw();
            }, this.waveTimerPeriod);
            analyser.getByteTimeDomainData(dataArray);
            this.emit('wave-capture', {
                dataArray,
                bufferLength
            });
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = v * 100;
                sum += y;
            }
            if (sum / bufferLength - 100 === 0) {
                if (this.player && !this.destroyTimer) {
                    this.destroyTimer = setTimeout(() => {
                        this.proxyObj.active = false;
                        clearTimeout(this.waveTimer);
                        this.player.destroy();
                    }, 3000);
                }
            }
            else {
                clearTimeout(this.destroyTimer);
                this.destroyTimer = null;
            }
        };

        // 启动绘制函数
        draw();
    }

    ttsStart($server) {
        if (this.proxyObj.ttsId) {
            return;
        }
        let token = localStorage.getItem('ApiToken');
        if (!token) return;
        token = token.replace('Bearer ', '');
        if (this.eventSource) this.eventSource.close();
        this.eventSource = new EventSource(
            `${$server}/voice/tts?Authorization=${token}`
        );
        this.eventSource.addEventListener('message', async (event) => {
            let data = JSON.parse(event.data);
            if (data.code === 0) {
                let msgData = data.data;
                if (msgData.type === 'ID') {
                    this.proxyObj.ttsId = msgData.data;
                }
                else if (msgData.type === 'AUDIO') {
                    let pcmBase64 = msgData.data;
                    if (pcmBase64) {
                        let pcmBlob = this.base64ToBlob(pcmBase64);
                        let pcmBuffer = await this.blobToBuffer(pcmBlob);
                        this.play(pcmBuffer);
                    }
                }
                else if (msgData.type === 'CLOSE') {
                    this.eventSource.close();
                    this.proxyObj.ttsId = null;
                }
                // console.log(msgData)
            }
            else {
                this.eventSource.close();
                this.proxyObj.ttsId = null;
            }
        });
        this.eventSource.addEventListener('error', (error) => {
            // console.log(error);
            this.eventSource.close();
            this.proxyObj.ttsId = null;
        });
    }

    ttsStop() {
        if (this.player && this.player.audioCtx) {
            this.player.pause();
            this.proxyObj.active = false;
            clearTimeout(this.waveTimer);
            this.player.destroy();
        }
        if (this.eventSource) {
            this.eventSource.close();
        }
        this.proxyObj.ttsId = null;
    }
}

export {
    LASSTT,
    LASTTS
};