<template>
    <div></div>
</template>

<script>
import { LASSTT } from '@/js/speecher';

export default {
    props: {
        sampleRate: {
            type: Number,
            default: 16000
        },
        bufferSize: {
            type: Number,
            default: 2048
        },
        pcmTimerPeriod: {
            type: Number,
            default: 500
        },
        active: {
            type: Boolean,
            default: false
        },
        lock: {
            type: Boolean,
            default: true
        },
        speed: {
            type: Number,
            default: 0.2
        },
        amplitude: {
            type: Number,
            default: 0
        },
        createMsg: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            speech: {
                speed: this.speed,
                amplitude: this.amplitude,
                active: this.active,
                lock: this.lock,
                sttId: null
            },
            stter: new LASSTT(
                this.sampleRate,
                this.bufferSize,
                this.pcmTimerPeriod
            )
        };
    },
    watch: {
        active(val) {
            this.speech.active = val;
        },
        lock(val) {
            this.speech.lock = val;
        },
        speed(val) {
            this.speech.speed = val;
        },
        amplitude(val) {
            this.speech.amplitude = val;
        },
        'speech.active'(val) {
            this.$emit('update:active', val);
        },
        'speech.lock'(val) {
            this.$emit('update:lock', val);
        },
        'speech.speed'(val) {
            this.$emit('update:speed', val);
        },
        'speech.amplitude'(val) {
            this.$emit('update:amplitude', val);
        }
    },
    mounted() {
        this.speechEventInit();
    },
    methods: {
        speechEventInit() {
            this.stter.on('active-change', ({ value }) => {
                this.speech.active = value;
            });
            this.stter.on('lock-change', ({ value }) => {
                this.speech.lock = value;
            });
            this.stter.on('sttId-change', ({ value }) => {
                this.speech.sttId = value;
            });
            this.stter.on('wave-capture', ({ dataArray, bufferLength }) => {
                let arr = [];
                for (let i = 0; i < bufferLength; i++) {
                    let v = dataArray[i] / 128.0;
                    let y = v * 100;
                    arr.push(y.toFixed(0));
                }
                let max = Math.max(...arr) - 100;
                let min = Math.min(...arr) - 100;
                let amplitude = Math.abs(((max - min) / 100) * 3);
                amplitude = amplitude * 1.2;
                this.speech.amplitude = amplitude > 3 ? 3 : amplitude;
                let sum = 0;
                arr.forEach((item) => {
                    sum += parseInt(item);
                });
                let average = sum / arr.length;
                let variance = 0;
                arr.forEach((item) => {
                    variance += Math.pow(item - average, 2);
                });
                variance = variance / arr.length;
                if (variance / 100 > 0.6) this.speech.speed = 0.6;
                else if (variance / 100 < 0.2) this.speech.speed = 0.2;
                else this.speech.speed = variance / 100;
            });
            this.stter.on('pcm-capture', ({ pcm16Blob, pcm16Base64 }) => {
                let url = URL.createObjectURL(pcm16Blob); // 生成URL
                let a = document.createElement('a');
                a.href = url;
                // a.download = 'recording.pcm';
                // a.click();
                URL.revokeObjectURL(url); // 释放URL
                if (this.speech.sttId) {
                    this.$api.VoiceController.sendSpeechToText(
                        this.speech.sttId,
                        {
                            data: pcm16Base64
                        }
                    ).then((res) => {});
                }
            });
            this.stter.on('sttText-change', ({ value }) => {
                if (value) {
                    this.$emit('insert-text', value);
                } else this.createMsg();
            });
            this.stter.on('error', () => {
                this.$barWarning('Device not found', {
                    status: 'error'
                });
            });
        }
    }
};
</script>

<style>
</style>