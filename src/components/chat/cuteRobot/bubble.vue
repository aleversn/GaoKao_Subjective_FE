<template>
    <div class="las-bubble">
        <div class="green"></div>
        <div class="pink"></div>
        <div class="blue"></div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.las-bubble {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 1em;
    height: 1em;
    font-size: 120px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    perspective: 1em;
    transform: rotate(0deg) translateZ(0);
    transform-origin: center center;
    animation: rainbow 3s infinite linear;
    transform-style: preserve-3d;
    box-shadow: 0 0 0.3em 0.05em #2c116e, inset 0.03em 0 0.1em 0.02em #de66e4;
    z-index: 1;

    & > div {
        position: absolute;
        top: 0.1em;
        left: 0.1em;
        width: 0.8em;
        height: 0.8em;
        border-radius: 50%;
    }

    $pink-rotate: 180deg;
    $green-rotate: 90deg;
    $blue-rotate: 270deg;

    $pink-color: rgba(215, 115, 229, 0.5);
    $green-color: rgba(142, 155, 224, 0.5);
    $blue-color: rgba(0, 153, 204, 0.5);

    @keyframes rainbow {
        0% {
            transform: rotate(0deg) translateZ(0);
            // box-shadow: 0 0 0.3em 0.05em #2c116e,
            //     inset 0.03em 0 0.1em 0.02em #de66e4;
            box-shadow: 0 0 5px 1px #2c116e,
                inset 0.03em 0 0.1em 0.02em #de66e4;
        }

        25% {
            transform: rotate(90deg) translateZ(0);
            box-shadow: 0 0 5px 1px #28126a,
                inset 0.03em 0 0.1em 0.02em rgba(142, 155, 225, 1);
        }

        50% {
            transform: rotate(180deg) translateZ(0);
            box-shadow: 0 0 5px 1px #28126a,
                inset 0.03em 0 0.1em 0.02em #19b3f5;
        }

        75% {
            transform: rotate(270deg) translateZ(0);
            box-shadow: 0 0 5px 1px #28126a,
                inset 0.03em 0 0.1em 0.02em #3d52ac;
        }

        100% {
            transform: rotate(360deg) translateZ(0);
            box-shadow: 0 0 5px 1px #28126a,
                inset 0.03em 0 0.1em 0.02em #de66e4;
        }
    }

    @mixin transform-rotate($ydeg: 0, $d3deg: 0) {
        transform: rotateY($ydeg) skew(14deg) rotate3d(1.1, 1, 0.9, $d3deg);
    }

    @mixin rotate-animation($ydeg: 0) {
        0% {
            @include transform-rotate($ydeg, 0deg);
            filter: blur(0px);
        }

        50% {
            @include transform-rotate($ydeg, 180deg);
            filter: blur(6px);
        }

        100% {
            @include transform-rotate($ydeg, 360deg);
            filter: blur(0px);
        }
    }

    @mixin keyframes($animationName) {
        @-webkit-keyframes #{$animationName} {
            @content;
        }
        @-moz-keyframes #{$animationName} {
            @content;
        }
        @-o-keyframes #{$animationName} {
            @content;
        }
        @keyframes #{$animationName} {
            @content;
        }
    }

    .blue {
        background: -webkit-linear-gradient(
            left,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 60%,
            $blue-color 100%
        );
        @include transform-rotate();
        animation: curve-rotate-blue 6s infinite linear;
    }

    .green {
        background: -webkit-linear-gradient(
            left,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 60%,
            $green-color 100%
        );
        @include transform-rotate();
        animation: curve-rotate-green 6s infinite linear;
    }

    .pink {
        background: -webkit-linear-gradient(
            left,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 50%,
            $pink-color 100%
        );
        @include transform-rotate($pink-rotate);
        animation: curve-rotate-pink 3s infinite linear;
    }

    @include keyframes(curve-rotate-green) {
        @include rotate-animation($green-rotate);
    }

    @include keyframes(curve-rotate-blue) {
        @include rotate-animation($blue-rotate);
    }

    @include keyframes(curve-rotate-pink) {
        @include rotate-animation($pink-rotate);
    }
}
</style>