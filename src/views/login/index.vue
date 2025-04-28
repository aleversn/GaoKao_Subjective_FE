<template>
    <div
        class="login-container"
        :class="[{dark: theme === 'dark'}]"
    >
        <banner-block></banner-block>
        <router-view></router-view>
        <bottom-banner></bottom-banner>
    </div>
</template>
  

  
<script>
import { mapGetters } from 'vuex';

import bannerBlock from '@/components/general/banner.vue';
import bottomBanner from '@/components/general/bottomBanner.vue';

export default {
    components: {
        bannerBlock,
        bottomBanner
    },
    computed: {
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    }
};
</script>

<style lang="scss">
.login-container {
    @include app;
    @include HcenterVcenterC;

    background: rgba(249, 250, 255, 1);

    &.dark {
        background: linear-gradient(
            200deg,
            rgba(39, 45, 89, 1),
            rgba(49, 43, 86, 1),
            rgba(30, 38, 53, 1),
            rgba(30, 38, 53, 1),
            rgba(30, 38, 53, 1),
            rgba(30, 38, 53, 1),
            rgba(30, 38, 53, 1)
        );
    }
}
</style>