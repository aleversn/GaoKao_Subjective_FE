<template>
    <div class="las-shimmer-container">
        <div class="shimmer-main">
            <span class="shimmer"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {}
};
</script>

<style lang="scss">
.las-shimmer-container {
    @include HcenterVcenter;

    position: relative;
    width: 100%;
    height: 100%;

    --glow-hue: 222deg;
    --shadow-hue: 180deg;
    --spring-duration: 1.33s;

    @keyframes shimmer {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes shine {
        0% {
            opacity: 0;
        }
        15% {
            opacity: 1;
        }
        55% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .shimmer-main {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        isolation: isolate;
        box-shadow: 0 2px 3px 1px hsl(var(--glow-hue) 50% 20% / 50%),
            inset 0 -10px 20px -10px hsla(var(--shadow-hue), 10%, 90%, 95%);

        &.active {
            transition-duration: calc(var(--spring-duration) * 0.5);
            scale: 1.2;
            box-shadow: 0 4px 8px -2px hsl(var(--glow-hue) 50% 20% / 50%),
                inset 0 0 0 transparent;
        }

        .shimmer {
            position: absolute;
            left: -40px;
            top: -40px;
            right: -40px;
            bottom: -40px;
            border-radius: inherit;
            mask-image: conic-gradient(
                from 0deg,
                transparent 0%,
                transparent 10%,
                black 36%,
                black 45%,
                transparent 50%,
                transparent 60%,
                black 85%,
                black 95%,
                transparent 100%
            );
            mask-size: cover;
            mix-blend-mode: plus-lighter;
            animation: shimmer 1s linear infinite both;

            &::before,
            &::after {
                transition: all 0.5s ease;
                opacity: 0;
                content: '';
                border-radius: inherit;
                position: absolute;
                mix-blend-mode: color;
                inset: 40px;
                pointer-events: none;
                opacity: 1;
                animation: shine 1.2s ease-in 1 infinite;
            }
            &::before {
                box-shadow: 0 0 3px 2px hsl(var(--glow-hue) 20% 95%),
                    0 0 7px 4px hsl(var(--glow-hue) 20% 80%),
                    0 0 13px 4px hsl(var(--glow-hue) 50% 70%),
                    0 0 25px 5px hsl(var(--glow-hue) 100% 70%);
                z-index: -1;
            }

            &::after {
                box-shadow: inset 0 0 0 1px hsl(var(--glow-hue) 70% 95%),
                    inset 0 0 2px 1px hsl(var(--glow-hue) 100% 80%),
                    inset 0 0 5px 2px hsl(var(--glow-hue) 100% 70%);
                z-index: 2;
            }
        }
    }

    .cute-robot-audio-wave {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}
</style>