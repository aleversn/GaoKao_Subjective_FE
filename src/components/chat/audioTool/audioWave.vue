<template>
    <div class="las-wave-container">

    </div>
</template>

<script>
import SiriWave from 'siriwave';

export default {
    props: {
        speed: {
            type: Number,
            default: 0.2
        },
        amplitude: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            siriWave: null
        };
    },
    watch: {
        speed() {
            this.updateValue();
        },
        amplitude() {
            this.updateValue();
        }
    },
    mounted() {
        setTimeout(() => {
            this.siriInit();
        }, 300);
    },
    methods: {
        siriInit() {
            this.siriWave = new SiriWave({
                container: this.$el,
                width: 1280,
                height: 400,
                cover: true,
                style: 'ios9',
                speed: this.speed,
                amplitude: this.amplitude,
                curveDefinition: [
                    { color: '255,255,255', supportLine: true },
                    { color: '15, 82, 169' }, // blue
                    { color: '149, 141, 241' }, // red
                    { color: '153, 156, 242' } // green
                ]
            });
        },
        widthObserverInit() {
            let observer = new ResizeObserver((entries) => {
                let entry = entries[0];
                let width = entry.contentRect.width;
                if (width > 0) {
                    this.siriInit();
                }
            });
            observer.observe(this.$el);
        },
        updateValue() {
            if (this.siriWave) {
                this.siriWave.setSpeed(this.speed);
                this.siriWave.setAmplitude(this.amplitude);
            }
        }
    },
    beforeDestroy() {
        if (this.siriWave) {
            this.siriWave.stop();
        }
    }
};
</script>

<style lang="scss">
.las-wave-container {
    position: relative;
    width: auto;
    height: auto;
}
</style>