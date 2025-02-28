<template>
    <div class="home-container">
        <banner-block class="banner-block"></banner-block>
        <main-page></main-page>
    </div>
</template>
  
<script>
import bannerBlock from '@/components/general/banner.vue';
import mainPage from '@/views/home/mainPage.vue';

export default {
    components: {
        bannerBlock,
        mainPage
    }
};
</script>

<style lang="scss" scoped>
.home-container {
    @include app;

    .banner-block {
        position: absolute;
        left: 0px;
        top: 0px;
    }
}
</style>