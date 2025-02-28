<template>
    <div
        class="chat-live-container"
        :style="styles"
    >
        <img
            draggable="false"
            class="models-bg"
            src="@/assets/home/modelsBlock/modelBoard.svg"
            alt
        />
        <img
            draggable="false"
            class="model-item-1"
            src="@/assets/home/modelsBlock/model1.svg"
            alt
        />
        <img
            draggable="false"
            class="model-item-2"
            src="@/assets/home/modelsBlock/model2.svg"
            alt
        />
        <img
            draggable="false"
            class="model-item-3"
            src="@/assets/home/modelsBlock/model3.svg"
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
                    (860 / 1450) *
                    this.$el.clientWidth
                ).toFixed(0)}px`;
                this.styles.fontSize = `${(this.$el.clientWidth / 654) * 12}px`;
                // this.count += 30 / 1000;
                // if (this.count >= 12) {
                //     // 过多久循环
                //     this.count = 0;
                //     this.animationInit();
                // }
            }, 30);
        },
        animationInit() {
            let t1 = gsap.timeline({ delay: 1 });
            t1.fromTo(
                '.models-bg',
                {
                    scaleY: 0,
                    transformOrigin: '0% 0%',
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
                '.model-item-1,.model-item-2,.model-item-3',
                {
                    translateY: -10,
                    transformOrigin: '50% 50%',
                    opacity: 0
                },
                {
                    translateY: -30,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out'
                }
            );

            let t2 = gsap.timeline({ delay: 3 });
            t2.fromTo(
                '.model-item-1',
                {
                    translateY: -30,
                    transformOrigin: '50% 50%'
                },
                {
                    translateY: 10,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power3.out'
                }
            );

            let t3 = gsap.timeline({ delay: 3 });

            t3.fromTo(
                '.model-item-2',
                {
                    translateY: -30,
                    transformOrigin: '50% 50%'
                },
                {
                    translateY: 13,
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.out'
                }
            );

            let t4 = gsap.timeline({ delay: 3 });

            t4.fromTo(
                '.model-item-3',
                {
                    translateY: -30,
                    transformOrigin: '50% 50%'
                },
                {
                    translateY: 10,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.out'
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

    .models-bg {
        position: relative;
        width: 100%;
        height: auto;
        flex-shrink: 0;
    }

    .model-item-1 {
        position: absolute;
        left: 28%;
        top: 30%;
        width: 16%;
        height: auto;
    }

    .model-item-2 {
        position: absolute;
        left: 40%;
        top: 50%;
        width: 16%;
        height: auto;
        z-index: 2;
    }

    .model-item-3 {
        position: absolute;
        left: 52%;
        top: 30%;
        width: 16%;
        height: auto;
    }
}
</style>

