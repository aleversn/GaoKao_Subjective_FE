<template>
    <transition name="fade-in">
        <div
            v-show="scrollTop > offset"
            class="retop"
            @click="retop"
        >
            <i class="ms-Icon ms-Icon--ChevronUp"></i>
        </div>
    </transition>
</template>

<script>
import gsap from 'gsap';

export default {
    props: {
        target: {
            default: () => {
                return {};
            }
        },
        offset: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            timer: null,
            scrollTop: 0
        };
    },
    computed: {
        thisTarget() {
            if (typeof this.target == 'function') return this.target();
            return this.target;
        }
    },
    mounted() {
        this.globalAppendInit();
        this.showInit();
    },
    methods: {
        retop() {
            gsap.to(this.thisTarget, {
                duration: 0.5,
                scrollTop: 0,
                ease: 'power2.out'
            });
        },
        showInit() {
            this.timer = setInterval(() => {
                this.scrollTop = this.thisTarget.scrollTop;
            }, 300);
        },
        globalAppendInit() {
            this.$nextTick(() => {
                const body = document.querySelector('body');
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
            });
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="scss">
.retop {
    position: fixed;
    width: 48px;
    right: 75px;
    height: 35px;
    bottom: 0px;
    background-color: rgba(235, 235, 235, 0.6);
    border-radius: 4px 4px 0 0;
    color: rgba(36, 36, 36, 1);
    text-align: center;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.9;
    z-index: 2;
    transition: background 1s, color 0.1s ease-in-out 0s;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.05);

    &:hover {
        background-color: rgba(0, 90, 158, 0.9);
        color: whitesmoke;
    }
}
.fade-in-enter,
.fade-in-leave-to {
    opacity: 0;
}
.fade-in-enter-to,
.fade-in-leave {
    opacity: 1;
}

.fade-in-enter-active {
    transition: all 0.8s;
}

.fade-in-leave-active {
    transition: all 0.1s;
}
</style>