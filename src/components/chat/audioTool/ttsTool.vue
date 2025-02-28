<template>
    <div></div>
</template>

<script>
import { LASTTS } from '@/js/speecher';

export default {
    props: {
        speed: {
            type: Number,
            default: 0.2
        },
        amplitude: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: false
        },
        context: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            speech: {
                speed: this.speed,
                amplitude: this.amplitude,
                active: this.active,
                ttsId: null
            },
            ttser: new LASTTS()
        };
    },
    watch: {
        active(val) {
            this.speech.active = val;
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
            this.ttser.on('ttsId-change', ({ value }) => {
                this.speech.ttsId = value;
                if (this.speech.ttsId) {
                    this.$api.VoiceController.sendTextToSpeech(
                        this.speech.ttsId,
                        {
                            data: this.context
                        }
                    ).then((res) => {});
                }
            });
            this.ttser.on('active-change', ({ value }) => {
                this.speech.active = value;
            });
            this.ttser.on('wave-capture', ({ dataArray, bufferLength }) => {
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
        },
        stop() {
            let status = this.speech.active;
            this.ttser.ttsStop();
            return status;
        }
    }
};
</script>

<style>
</style>