<template>
    <div
        class="cute-robot-container"
        :class="[{dark: theme === 'dark'}]"
        :style="{top: currentTop, width: `${size}px`, height: `${size}px`}"
        @mousedown="forward"
        @mouseup="stop"
        @touchstart="forward"
        @touchend="stop"
        @click="clickEvent"
    >
        <transition name="fade-in">
            <shimmer v-if="speech.active"></shimmer>
        </transition>
        <div
            v-if="speech.active"
            class="cute-robot-audio-wave-container"
        >
            <audio-wave
                v-if="speech.active"
                class="cute-robot-audio-wave"
                :speed="speech.speed"
                :amplitude="speech.amplitude"
            ></audio-wave>
        </div>
        <transition
            name="fade-in"
            :duration="300"
        >
            <bubble
                v-if="!speech.active"
                :style="{'font-size': `${size}px`}"
            ></bubble>
        </transition>
        <tts-tool
            ref="tts"
            :active.sync="speech.active"
            :lock.sync="speech.lock"
            :speed.sync="speech.speed"
            :amplitude.sync="speech.amplitude"
            :context="thisContext"
        ></tts-tool>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import bubble from './bubble.vue';
import shimmer from './shimmer.vue';
import audioWave from '@/components/chat/audioTool/audioWave.vue';

import ttsTool from '@/components/chat/audioTool/ttsTool.vue';

export default {
    components: {
        bubble,
        shimmer,
        audioWave,
        ttsTool
    },
    props: {
        size: {
            type: Number,
            default: 120
        },
        active: {
            type: Boolean,
            default: false
        },
        top: {
            default: 0
        },
        welcome: {
            type: String,
            default: '你好啊，我是人工智能助手PC，很高兴为您服务。'
        },
        context: {
            type: String,
            default: '你好啊，我是人工智能助手PC，很高兴为您服务。'
        }
    },
    data() {
        return {
            speech: {
                speed: 0.2,
                amplitude: 0,
                active: false,
                ttsId: null
            },
            thisContext: this.context,
            moveable: false,
            disY: 0,
            currentTop: '50%'
        };
    },
    watch: {
        active(val) {
            this.speech.active = val;
        },
        'speech.active'(val) {
            if (!val) this.thisContext = '';
            this.$emit('update:active', val);
        },
        context(val) {
            this.thisContext = val;
        },
        thisContext(val) {
            if (!this.speech.active && val)
                this.$refs.tts.ttser.ttsStart(this.$server);
            this.$emit('update:context', val);
        },
        top(val) {
            this.currentTop = `${val}px`;
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.Init();
    },
    methods: {
        Init() {
            window.addEventListener('mousemove', (event) => {
                if (this.moveable) {
                    this.currentTop = `${event.clientY - this.disY}px`;
                }
            });
            window.addEventListener('touchmove', (event) => {
                event = event.targetTouches[0];
                if (this.moveable) {
                    this.currentTop = `${event.clientY - this.disY}px`;
                }
            });
            window.addEventListener('mouseup', (event) => {
                if (this.moveable) {
                    this.stop();
                }
            });
            window.addEventListener('touchup', (event) => {
                if (this.moveable) {
                    this.stop();
                }
            });
        },
        forward(event) {
            this.moveable = true;
            event.preventDefault();
            let { clientY } = event.targetTouches
                ? event.targetTouches[0]
                : event;
            this.disY = clientY - this.$el.getBoundingClientRect().top;
        },
        stop() {
            this.moveable = false;
            if (this.$el.getBoundingClientRect().top < 0)
                this.currentTop = `0px`;
            if (
                this.$el.getBoundingClientRect().top + this.$el.clientHeight >
                window.innerHeight
            )
                this.currentTop = `${
                    window.innerHeight - this.$el.clientHeight
                }px`;
        },
        read() {
            this.thisContext = '';
            this.thisContext = this.welcome;
        },
        clickEvent() {
            if (!this.$refs.tts.stop()) this.$emit('robot-click');
        }
    }
};
</script>

<style lang="scss">
.cute-robot-container {
    @include HcenterVcenter;

    position: fixed;
    left: 30px;
    top: 50%;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transition: scale 0.3s ease-out;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    &.dark {
        background: rgba(20, 28, 33, 0.6);
    }

    &:hover {
        scale: 1.1;
    }

    &:active {
        scale: 1.05;
    }

    .cute-robot-audio-wave-container {
        @include HcenterVcenter;

        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        filter: blur(1px);
        opacity: 0.6;

        .cute-robot-audio-wave {
            top: 10%;
            width: 300%;
            height: 150%;
        }
    }

    .fade-in-enter-active,
    .fade-in-leave-active {
        transition: scale 0.3s, opacity 0.3s;
    }

    .fade-in-enter,
    .fade-in-leave-to {
        scale: 0.9;
        opacity: 0;
    }

    .fade-in-enter-to,
    .fade-in-leave {
        scale: 1;
        opacity: 1;
    }
}
</style>