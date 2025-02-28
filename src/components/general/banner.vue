<template>
    <div
        class="banner-block"
        :style="{background: background}"
    >
        <div
            class="logo-block"
            @click="$route.path === '/' ? $Go('/') : $Go('/board')"
        >
            <img
                v-show="!avatar || !showModelInfo"
                draggable="false"
                class="logo"
                src="@/assets/logo.svg"
                alt
            />
            <img
                v-show="avatar && showModelInfo"
                draggable="false"
                class="logo"
                :src="avatar"
                alt
            />
            <img
                v-show="!nickname || !showModelInfo"
                class="logo-text"
                draggable="false"
                src="@/assets/logo_text.svg"
                alt=""
            >
            <p v-show="nickname && showModelInfo">{{nickname}}</p>
        </div>
        <div class="control-block">
            <fv-button
                v-show="!isLogin"
                :background="color"
                theme="dark"
                :font-size="12"
                borderRadius="6"
                :is-box-shadow="true"
                style="height: 25px;"
                @click="$Go('/login')"
            >登录</fv-button>
            <fv-persona
                v-show="isLogin"
                :src="userInfo.avatar"
                size="36"
                :background="gray01"
                :name="userInfo.nickname"
                @click.native="avatarClick"
            ></fv-persona>
        </div>
    </div>
</template>
  
  <script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        background: {
            default: ''
        }
    },
    data() {
        return {
            show: {
                profile: false
            }
        };
    },
    watch: {
        'userInfo.id'() {
            this.getAvatar();
        }
    },
    computed: {
        ...mapGetters('Theme', ['color', 'gray01']),
        ...mapState({
            userInfo: (state) => state.User.info
        }),
        ...mapState('Model', {
            avatar: (state) => state.avatar,
            nickname: (state) => state.nickname
        }),
        isLogin() {
            return this.userInfo.id;
        },
        showModelInfo() {
            return this.$route.path.startsWith('/board');
        }
    },
    mounted() {
        this.getAvatar();
    },
    methods: {
        async getAvatar() {},
        avatarClick() {
            if (this.$route.path === '/') {
                this.$Go('/board');
            } else {
                this.show.profile = true;
            }
        }
    },
    beforeDestroy() {}
};
</script>

<style lang="scss">
.banner-block {
    @include HbetweenVcenter;

    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 50px;
    padding: 0px 18px;
    z-index: 2;

    .logo-block {
        @include Vcenter;

        user-select: none;

        .logo {
            width: 30px;
            height: 30px;
            object-fit: cover;
            border-radius: 50%;
            cursor: pointer;
        }

        .logo-text {
            width: 30px;
            height: auto;
            margin-left: 15px;
            cursor: pointer;
        }

        p {
            @include color-pink-blue;
            @include nowrap;

            margin-left: 15px;
            font-size: 13.8px;
            font-weight: 600;
            user-select: none;
        }
    }

    .control-block {
        @include Vcenter;
    }
}
</style>