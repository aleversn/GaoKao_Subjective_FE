<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import i18n from '@/js/i18n.js';

import banner from '@/components/general/banner.vue';
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'App',
    components: {
        banner
    },
    watch: {
        $route() {
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.User.info
        })
    },
    mounted() {
        this.i18nInit();
    },
    methods: {
        ...mapMutations({
            reviseI18N: 'reviseI18N'
        }),
        ...mapMutations('User', {
            setInfo: 'setInfo'
        }),
        ...mapMutations('Theme', {
            reviseTheme: 'reviseTheme'
        }),
        i18nInit() {
            this.reviseI18N(i18n);
        },
        async getAvatar() {
            if (this.userInfo.id) {
                this.$api.UserController.getAvatar(this.userInfo.id)
                    .then((res) => {
                        if (res.code == 200)
                            this.setInfo({
                                avatar: res.data ? res.data : null
                            });
                    })
                    .catch(() => {});
            }
        }
    }
};
</script>

<style lang="scss">
body {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

#app {
    position: relative;
    width: 100%;
    height: 100%;
}

* {
    @include narrow-scroll-bar;

    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
}
</style>
