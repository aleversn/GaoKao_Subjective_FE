<template>
    <fv-navigation-view
        v-model="currentNav"
        :title="`Windows X`"
        :options="navList"
        :expand.sync="isExpand"
        :flyout-display="1368"
        :mobile-display="1024"
        class="navigation-view"
        :setting-title="`设置`"
        :show-setting="userInfo.status"
        @item-click="handleItemClick"
        @back="$Back()"
    ></fv-navigation-view>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            currentNav: {
                name: '壁纸',
                icon: 'PictureFill',
                href: '/wallpaper',
            },
            navList: [
                {
                    name: '生态',
                    type: 'header',
                },
                {
                    name: '资讯',
                    icon: 'News',
                    href: '/news',
                },
                {
                    name: '壁纸',
                    icon: 'PictureFill',
                    href: '/wallpaper',
                },
                {
                    name: '下载',
                    icon: 'WebAppBuilderFragment',
                    href: '/res',
                },
                {
                    name: '',
                    type: 'divider',
                },
                {
                    name: '登录',
                    icon: 'Contact',
                    func: () => {
                        this.$Go(`/login?returnurl=${this.$route.path}`);
                    },
                    show: () => !this.userInfo.status,
                },
                {
                    name: () => this.userName,
                    type: 'header',
                    show: () => this.userInfo.status,
                },
                {
                    name: '数据中心',
                    icon: 'World',
                    show: () => this.userInfo.status,
                    href: '/user/center',
                },
                {
                    name: '编辑部',
                    icon: 'PreviewLink',
                    show: () => this.userInfo.status,
                    href: '/user/edit',
                },
                {
                    name: '视频中心',
                    icon: 'Video',
                    show: () => this.userInfo.status,
                    href: '/user/video',
                },
                {
                    name: '资源中心',
                    icon: 'Download',
                    show: () => this.userInfo.status,
                    href: '/user/res',
                },
                {
                    name: '主页管理',
                    icon: 'Home',
                    show: () => this.userInfo.status,
                    href: '/user/slider',
                },
                {
                    name: '壁纸管理',
                    icon: 'ImageDiff',
                    show: () => this.userInfo.status,
                    href: '/user/wallpaper',
                },
                {
                    name: '个人中心',
                    icon: 'UserEvent',
                    show: () => this.userInfo.status,
                    href: '/personal',
                },
                {
                    name: '注销',
                    icon: 'PowerButton',
                    show: () => this.userInfo.status,
                    func: () => this.logout(),
                },
            ],
            isExpand: false,
        };
    },
    watch: {
        $route(to, from) {
            this.isExpand = false;
            this.navInit();
        },
        currentNav: {
            handler(to, from) {
                if (from.href !== to.href) this.$Go(to.href);
            },
            deep: true,
        },
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.userInfo,
        }),
        userName() {
            return this.userInfo.name == '' || this.userInfo.name == undefined ? '未设置名称' : this.userInfo.name;
        },
    },
    mounted() {
        this.navInit();
    },
    methods: {
        navInit() {
            let path = this.$route.path;
            let item = this.navList.find((it) => it.href === path);
            if (item && this.currentNav.href !== path) this.currentNav = item;
        },
        handleItemClick(item) {
            if (item.href) this.$Go(item.href);
            if (item.func) item.func();
        },
        logout() {
            localStorage.removeItem('apiKey');
            this.deActiveUserInfo();
        },
        async deActiveUserInfo() {
            this.$store.commit('setUserInfo', {
                status: false,
                prop: '',
            });
        },
    },
};
</script>

<style lang="scss">
.navigation-view {
    height: 100%;
    z-index: 6;

    .flyout {
        min-width: 0px;
    }
}
</style>