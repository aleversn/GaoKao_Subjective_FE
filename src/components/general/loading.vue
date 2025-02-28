<template>
    <div class="loading">
        <img
            src="@/assets/logo.svg"
            draggable="false"
            class="logo"
            alt=""
        />
        <fv-progress-ring
            :loading="true"
            r="10"
            borderWidth="2"
            :color="'rgba(178, 140, 226, 1)'"
        ></fv-progress-ring>
    </div>
</template>

<style lang="scss" scoped>
.loading {
    @include FullAbsolute;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(255, 255, 255, 0.9);
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    z-index: 15;

    .logo {
        width: 45px;
        height: auto;
        margin-bottom: 15px;
    }
}
</style>
