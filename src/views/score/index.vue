<template>
    <div class="home-container">
        <banner-block></banner-block>
        <router-view></router-view>
    </div>
</template>
  

  
<script>
import bannerBlock from '@/components/general/banner.vue';

export default {
    components: {
        bannerBlock
    }
};
</script>

<style lang="scss">
.home-container {
    @include app;
    
    display: flex;
    flex-direction: column;
}
</style>