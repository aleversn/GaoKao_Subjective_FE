<template>
    <div class="home-main-page-container">
        <div class="home-row">
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
            >
                <div class="text-block">
                    <h1>智能, 可靠</h1>
                    <p style="font-size: 18px;">
                        基于Open AI GPT系列的大语言模型构建的问答系统
                    </p>
                    <fv-button
                        theme="dark"
                        :background="gradient"
                        borderRadius="50"
                        fontSize="18"
                        fontWeight="600"
                        style="width: 300px; height: 45px; margin-top: 25px;"
                        @click="userInfo.id ? $Go('/chat') : $Go('/login/apply')"
                    >快速开始</fv-button>
                </div>
            </fv-ScrollStory>
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
                style="display: flex; justify-content: center;"
            >
                <chat-live class="svg-block"></chat-live>
            </fv-ScrollStory>
        </div>
        <div class="home-row">
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
            >
                <rtf-container class="svg-block"></rtf-container>

            </fv-ScrollStory>
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
            >
                <div class="text-block">
                    <h1>富文本提问</h1>
                    <p style="font-size: 18px;">
                        基于PowerEditor的强大编辑器, 使您与AI交互更加人性化
                    </p>
                    <fv-button
                        theme="dark"
                        background="#FFA840"
                        borderRadius="50"
                        fontSize="18"
                        fontWeight="600"
                        style="width: 300px; height: 45px; margin-top: 25px;"
                        @click="userInfo.id ? $Go('/chat') : $Go('/login')"
                    >{{userInfo.id ? '马上体验' : '马上登录'}}</fv-button>
                </div>
            </fv-ScrollStory>
        </div>
        <div class="home-row">
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
            >
                <div class="text-block">
                    <h1>多语言模型</h1>
                    <p style="font-size: 18px;">
                        包含Open AI多个版本的模型, 您可以根据自己的需求选择不同的模型
                    </p>
                </div>
            </fv-ScrollStory>
            <fv-ScrollStory
                :target="thisEl"
                name="scale-up-to-up"
            >
                <models-block class="svg-block"></models-block>
            </fv-ScrollStory>
        </div>
        <div class="home-row bottom">
            <p>LAS™</p>
            <p><a href="https://beian.miit.gov.cn/#/Integrated/index">闽ICP备2023010064号</a> | © {{ currentYear }} 福州零壹拾光网络有限公司</p>
        </div>
        <img
            src="@/assets/home/home_bg_1.svg"
            alt
            style="position: absolute; left: -180px; top: 50px; z-index: -1;"
        />
        <img
            src="@/assets/home/home_bg_1.svg"
            alt
            style="position: absolute; right: -180px; top: 100%; z-index: -1;"
        />
        <img
            src="@/assets/logo.svg"
            alt
            style="position: absolute; right: 120px; top: 20%; width: 450px; filter: blur(28px); z-index: -1;"
        />
    </div>
</template>
  
  <script>
import { mapState, mapGetters } from 'vuex';

import modelsBlock from '@/components/home/modelsBlock.vue';
import rtfContainer from '@/components/home/rtfContainer.vue';
import chatLive from '@/components/home/chatLive.vue';

export default {
    components: {
        modelsBlock,
        rtfContainer,
        chatLive
    },
    data() {
        return {
            thisEl: {}
        };
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'gray01']),
        ...mapState({
            userInfo: (state) => state.User.info
        }),
        currentYear() {
            return new Date().getFullYear();
        }
    },
    mounted() {
        this.thisEl = this.$el;
    }
};
</script>

<style lang="scss">
.home-main-page-container {
    position: relative;
    width: 100%;
    min-height: 100%;
    height: 100%;
    overflow: overlay;
    overflow-x: hidden;

    .home-row {
        @include HbetweenVcenter;

        position: relative;
        flex: 1;
        width: 100%;
        min-height: 100%;
        height: 100%;
        padding: 0px calc(50% - 512px);
        float: left;

        &.intro {
            @include HcenterVcenterC;

            min-height: 50%;
            height: 50%;
            padding-top: 25px;
            padding-bottom: 25px;

            img.bg {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                object-fit: cover;
                filter: blur(3px);
                opacity: 0.3;
            }

            .flip-view-block {
                @include HbetweenVcenter;

                position: relative;
                width: 100%;
                height: 100%;
                padding: 15px;

                .left-block {
                    @include HcenterVcenterC;

                    position: relative;
                    width: 400px;
                    height: 100%;
                    background: whitesmoke;
                    border-radius: 8px;
                    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);

                    img {
                        width: 120px;
                        height: auto;
                    }

                    p {
                        @include pink-a;

                        margin-top: 15px;
                        font-size: 28px;
                        font-weight: 600;
                        color: $theme-orange-1;
                        text-align: center;
                        cursor: inherit;
                    }
                }

                .text-block {
                    width: 500px;
                }
            }
        }

        &.bottom {
            @include HbetweenVcenter;

            min-height: 30px;
            height: 30px;
            padding: 0px 18px;
            background: whitesmoke;

            p {
                font-size: 12px;
                color: rgba(96, 96, 96, 1);

                a {
                    color: rgba(120, 120, 120, 1);
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }

        .text-block {
            position: relative;
            width: 400px;
            line-height: 2;

            h1 {
                @include color-black-gray;

                color: rgba(50, 49, 48, 1);
            }

            p {
                margin-top: 25px;
                color: rgba(96, 96, 96, 1);
            }
        }

        .info-block {
            @include HcenterVcenterC;

            width: 100%;
            height: auto;
            margin-bottom: 35px;
            line-height: 2.5;
        }

        .svg-block {
            width: 500px;
            border-radius: 12px;

            &.no-shadow {
                box-shadow: none;
            }
        }
    }
}

@media screen and (max-width: 1024px) {
    .home-main-page-container {
        .home-row {
            @include HcenterVcenterC;

            &.intro {
                min-height: 100%;
                height: 100%;

                .flip-view-block {
                    @include HcenterVcenterC;

                    .left-block {
                        width: 100%;

                        img {
                            width: 50%;
                            height: auto;
                        }

                        p {
                            margin: 15px;
                        }
                    }

                    .text-block {
                        width: 100%;
                    }
                }
            }

            &.bottom {
                flex-direction: row;

                p:first-child
                {
                    display: none;
                }
            }

            .text-block {
                @include HcenterVcenterC;

                width: 100%;
                margin: 25px 0px;

                p {
                    margin: 15px;
                }
            }

            .info-block {
                padding: 25px;
            }

            .svg-block {
                width: 60%;

                &.no-shadow {
                    width: 100%;
                }
            }
        }

        .fv-light-ScrollStory {
            div:first-child {
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>