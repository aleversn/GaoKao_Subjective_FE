<template>
    <div class="law-main-container">
        <power-editor
            :editable="false"
            :editorOutSideBackground="'white'"
            style="height: 100%; flex: 1;"
        >
        </power-editor>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.law-main-container {
    @include FullRelative;

    display: flex;
}
</style>