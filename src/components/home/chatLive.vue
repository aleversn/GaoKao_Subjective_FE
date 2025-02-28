<template>
    <div
        class="chat-live-container"
        :style="styles"
    >
        <img
            draggable="false"
            class="chat-bg"
            src="@/assets/home/chatLive/chatBoard.svg"
            alt
        />
        <img
            draggable="false"
            class="chat-b1"
            src="@/assets/home/chatLive/chatB1.svg"
            alt
        />
        <img
            draggable="false"
            class="chat-b2"
            src="@/assets/home/chatLive/chatB2.svg"
            alt
        />
        <img
            draggable="false"
            class="chat-content"
            src="@/assets/home/chatLive/chatContent.svg"
            alt
        />
    </div>
</template>

<script>
import gsap from 'gsap';

export default {
    data() {
        return {
            count: 0,
            num: 0,
            styles: {
                height: `0px`,
                fontSize: `12px`
            },
            mousePosition: [
                {
                    left: '50%',
                    top: '50%'
                },
                {
                    left: '16%',
                    top: '12%'
                }
            ],
            timer: {}
        };
    },
    mounted() {
        this.timerInit();
        this.animationInit();
    },
    methods: {
        timerInit() {
            this.timer = setInterval(() => {
                this.styles.height = `${(
                    (600 / 500) *
                    this.$el.clientWidth
                ).toFixed(0)}px`;
                this.styles.fontSize = `${(this.$el.clientWidth / 654) * 12}px`;
                this.count += 30 / 1000;
                if (this.count >= 12) {
                    // 过多久循环
                    this.count = 0;
                    this.animationInit();
                }
            }, 30);
        },
        animationInit() {
            let t1 = gsap.timeline({ delay: 1 });
            t1.fromTo(
                '.chat-bg',
                {
                    scaleY: 0,
                    transformOrigin: '0% 100%',
                    opacity: 0
                },
                {
                    scaleY: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );
            t1.fromTo(
                '.chat-b1',
                {
                    translateX: '-100%',
                    transformOrigin: '50% 50%',
                    opacity: 0
                },
                {
                    translateX: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power3.out'
                }
            );
            t1.fromTo(
                '.chat-b2',
                {
                    translateX: '100%',
                    transformOrigin: '50% 50%',
                    opacity: 0
                },
                {
                    translateX: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power3.out'
                }
            );
            t1.fromTo(
                '.chat-content',
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="scss" scoped>
.chat-live-container {
    @include HcenterVcenter;

    position: relative;
    width: 654px;
    height: auto;
    overflow: visible;

    .chat-bg {
        position: relative;
        width: 100%;
        height: auto;
        flex-shrink: 0;
    }

    .chat-b1 {
        position: absolute;
        left: -10%;
        top: 10%;
        width: 90%;
        height: auto;
    }

    .chat-b2 {
        position: absolute;
        bottom: 10%;
        right: -10%;
        width: 90%;
        height: auto;
    }

    .chat-content {
        position: absolute;
        width: 80%;
        height: auto;
    }
}
</style>

