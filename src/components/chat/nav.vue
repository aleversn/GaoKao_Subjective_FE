<template>
    <div
        class="nav-block"
        :class="[{dark: theme === 'dark', hidden: !show.globalNav}]"
    >
        <fv-AnimatedIcon
            value="scaleXDown"
            fontSize="16"
            icon="GlobalNavButton"
            class="global-nav-button"
            :hideContent="true"
            style="width: 35px; height: 35px;"
            @click="show.globalNav = !show.globalNav"
        >
        </fv-AnimatedIcon>
        <div
            class="navigation-view-mode-block"
            :class="[{dark: theme === 'dark'}]"
        >
            <div class="navigation-view-mode-left-block">
                <fv-AnimatedIcon
                    value="scaleXDown"
                    fontSize="16"
                    icon="RectangularClipping"
                    :title="local('New Chat')"
                    style="width: 100%;"
                    :style="{color: theme === 'dark' ? 'whitesmoke' : ''}"
                    @click="show.newChat = true"
                >
                    <template v-slot:default>
                        <img
                            draggable="false"
                            class="img-icon"
                            src="@/assets/chat/newChat.svg"
                            alt=""
                        >
                    </template>
                    <template v-slot:content>
                        <div style="margin-left: 15px; font-size: 13.8px;">{{local('New Chat')}}</div>
                    </template>
                </fv-AnimatedIcon>
                <p class="title"></p>
            </div>
            <div class="navigation-view-mode-right-block">
                <i
                    class="ms-Icon ms-Icon--Refresh more-menu-btn"
                    :title="local('Refresh Chats')"
                    @click="getChats"
                ></i>
            </div>
        </div>
        <transition
            name="foldder"
            duration="300"
        >
            <div
                v-show="show.newChat"
                class="new-chat-info-block"
            >
                <fv-text-box
                    v-model="chatName"
                    :theme="theme"
                    :placeholder="local(`New Chat Name`)"
                    ref="newChat"
                    style="width: 100%; height: 45px; margin-top: 5px;"
                    @keyup="addChat"
                ></fv-text-box>
                <fv-combobox
                    v-model="currentModel"
                    :theme="theme"
                    :placeholder="local(`Select Model`)"
                    :options="modelList"
                    :disabled="!lock.model"
                    :itemHeight="60"
                    style="width: 100%; height: 45px; margin-top: 5px;"
                >
                    <template v-slot:default="x">
                        <i
                            class="before-choosen"
                            :style="{background: gradient}"
                        ></i>
                        <div class="combobox-custom-content">
                            <p class="main-title">{{x.item.text}}</p>
                            <span class="info-block">
                                <p class="max-len">{{local('Max Len')}}: {{(x.item.maxLength / 1000).toFixed(0)}}k</p>
                                <span class="price-block">
                                    <i
                                        class="ms-Icon ms-Icon--StatusCircleInner"
                                        :style="{color: computePrice(x.item) === false ? 'rgba(241, 154, 30, 1)' : ''}"
                                    ></i>
                                    <p>{{computePrice(x.item) !== false ? `￥ ${computePrice(x.item)}/k` : local('Not Available')}}</p>
                                </span>
                            </span>
                        </div>
                    </template>
                </fv-combobox>
                <fv-button
                    theme="dark"
                    :background="gradient"
                    :border-radius="6"
                    :is-box-shadow="true"
                    :disabled="!lock.chat || !chatName || !currentModel.id"
                    style="width: 150px; margin-top: 15px;"
                    @click="addChat"
                >{{local(`Create Chat`)}}</fv-button>
            </div>
        </transition>
        <fv-list-view
            v-if="chatList.length > 0"
            v-show="show.globalNav"
            v-model="chatList"
            :theme="theme"
            :choosen="navChoosen"
            :row-height="60"
            :choosen-background="gradient01"
            style="width: 100%; height: 100%; flex: 1; transition: all 0.3s;"
            @chooseItem="itemClick"
        >
            <template v-slot:listItem="x">
                <div
                    class="list-view-custom-item"
                    @contextmenu="rightClick($event, x.item)"
                >
                    <img
                        draggable="false"
                        class="img-icon"
                        src="@/assets/chat/chat.svg"
                        alt=""
                    >
                    <fv-text-box
                        v-model="x.item.name"
                        :theme="theme"
                        :placeholder="local(`Chat Name`)"
                        :foreground="theme === 'dark' && x.item.editable ? 'black' : ''"
                        :background="x.item.editable ? 'whitesmoke' : 'transparent'"
                        :border-width="2"
                        :readonly="!x.item.editable"
                        :border-color="x.item.editable ? color : 'transparent'"
                        :focus-border-color="x.item.editable ? color : 'transparent'"
                        :is-box-shadow="x.item.editable"
                        underline
                        style="flex: 1; margin-left: 5px;"
                        @click.native="$event => {x.item.editable ? $event.stopPropagation() : ''}"
                        @touchend.native="$event.stopPropagation()"
                        @keyup.enter="updateChat(x.item)"
                    ></fv-text-box>
                    <div class="list-view-control">
                        <fv-button
                            :theme="theme"
                            :border-radius="50"
                            :disabled="!x.item.name"
                            :is-box-shadow="true"
                            style="width: 30px; height: 30px;"
                            @touchend.native="$event.stopPropagation()"
                            @click="$event => {$event.stopPropagation(); updateChat(x.item)}"
                        >
                            <i
                                class="ms-Icon"
                                :class="[`ms-Icon--${x.item.editable ? 'Accept' : 'Edit'}`]"
                            ></i></fv-button>
                        <fv-button
                            theme="dark"
                            background="rgba(213, 38, 45, 1)"
                            :border-radius="50"
                            :disabled="!lock.delChat"
                            :is-box-shadow="true"
                            style="width: 30px; height: 30px; margin-left: 5px;"
                            @touchend.native="$event.stopPropagation()"
                            @click="$event => {$event.stopPropagation(); deleteChat(x.item)}"
                        >
                            <i
                                class="ms-Icon ms-Icon--Delete"
                                style="color: whitesmoke;"
                            ></i>
                        </fv-button>
                    </div>
                </div>
            </template>
        </fv-list-view>
        <nav-empty v-else></nav-empty>
        <right-menu
            ref="rightMenu"
            :theme="theme"
        >
            <div>
                <span @click="show.newChat = true">
                    <i
                        class="ms-Icon ms-Icon--SubscriptionAdd"
                        style="color: rgba(0, 120, 212, 1);"
                    ></i>
                    <p>{{local("New Chat")}}</p>
                </span>
                <span @click="updateChat(rightMenuItem)">
                    <i
                        class="ms-Icon ms-Icon--Rename"
                        style="color: rgba(0, 120, 212, 1);"
                    ></i>
                    <p>{{local("Rename")}}</p>
                </span>
                <span @click="deleteChat(rightMenuItem)">
                    <i
                        class="ms-Icon ms-Icon--Delete"
                        style="color: rgba(173, 38, 45, 1);"
                    ></i>
                    <p>{{local("Delete")}}</p>
                </span>
            </div>
        </right-menu>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import noteImg from '@/assets/nav/note.svg';

import navEmpty from '@/components/general/empty/navEmpty.vue';
import rightMenu from '@/components/general/rightMenu.vue';

export default {
    components: {
        navEmpty,
        rightMenu
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        local: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            chatName: '',
            currentModel: {},
            chatList: [],
            modelList: [],
            navChoosen: [],
            rightMenuItem: {},
            show: {
                newChat: false,
                globalNav: true
            },
            lock: {
                chat: true,
                addChat: true,
                model: true,
                delChat: true
            }
        };
    },
    watch: {
        $route() {
            this.getRouteChoosen();
        },
        value() {},
        thisValue() {
            this.$emit('input', this.thisValue);
        },
        'show.newChat'(val) {
            if (val) {
                setTimeout(() => {
                    this.$refs.newChat.focus();
                }, 300);
            }
        }
    },
    computed: {
        ...mapGetters('Theme', ['color', 'gradient', 'gradient01', 'theme']),
        computePrice() {
            return (item) => {
                if (item.completionPrice != null && item.promptPrice != null) {
                    return (
                        ((item.completionPrice + item.promptPrice) / 2 / 1e6) *
                        1e3
                    ).toFixed(3);
                } else {
                    return false;
                }
            };
        }
    },
    mounted() {
        this.getChats();
        this.getModels();
        this.eventInit();
    },
    methods: {
        eventInit() {
            window.addEventListener('click', this.outsideClickEvent);
        },
        async getChats() {
            if (!this.lock.chat) return;
            this.lock.chat = false;
            await this.$api.ModelController.getChats(0, 50)
                .then((res) => {
                    if (res.code === 200) {
                        let chats = res.data;
                        let formatChats = [];
                        for (let item of chats) {
                            let obj = this.formatChat(item);
                            formatChats.push(obj);
                        }
                        this.chatList = formatChats;
                        if (
                            !this.$route.params.chatid &&
                            this.chatList.length > 0
                        )
                            this.$Go(`/chat/${formatChats[0].chatId}`);
                        this.getRouteChoosen();
                    }
                })
                .catch((res) => {
                    if (res.message)
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                });
            this.lock.chat = true;
        },
        async getModels() {
            if (!this.lock.model) return;
            this.lock.model = false;
            await this.$api.ModelController.getModels()
                .then((res) => {
                    let models = res.data;
                    let formatModels = [];
                    for (let item of models) {
                        let obj = this.formatModel(item);
                        formatModels.push(obj);
                    }
                    this.modelList = formatModels;
                    if (!this.currentModel.id)
                        this.currentModel = formatModels[0];
                })
                .catch((res) => {
                    if (res.message)
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                });
            this.lock.model = true;
        },
        async addChat(event = null) {
            if (!this.lock.addChat) return;
            if (!this.chatName) return;
            if (!this.currentModel.id) return;
            if (event.keyCode) {
                if (event.keyCode !== 13) return;
            }
            this.lock.addChat = false;
            await this.$api.ModelController.createChat(this.currentModel.id, {
                name: this.chatName
            })
                .then((res) => {
                    if (res.code === 200) {
                        this.chatName = '';
                        this.getChats();
                        this.show.newChat = false;
                    }
                })
                .catch((e) => {
                    if (e.message)
                        this.$barWarning(e.message, {
                            status: 'error'
                        });
                });
            this.lock.addChat = true;
        },
        formatChat(item) {
            return {
                key: item.chatId,
                ...item,
                editable: false
            };
        },
        formatModel(item) {
            return {
                key: item.id,
                ...item,
                text: item.modelId.toUpperCase(),
                disabled:
                    item.completionPrice == null || item.promptPrice == null
            };
        },
        async updateChat(item) {
            if (!item.editable) item.editable = true;
            else {
                if (!item.name) return;
                await this.$api.ModelController.updateChat(item.chatId, {
                    name: item.name
                })
                    .then((res) => {
                        if (res.code === 200) {
                            item.editable = false;
                        }
                    })
                    .catch((e) => {
                        if (e.message)
                            this.$barWarning(e.message, {
                                status: 'error'
                            });
                    });
            }
        },
        deleteChat(item) {
            if (!this.lock.delChat) return;
            this.$infoBox(
                this.local(`Are you sure you want to delete this Chat?`),
                {
                    status: 'error',
                    title: this.local('Delete Chat'),
                    confirmTitle: this.local('Confirm'),
                    cancelTitle: this.local('Cancel'),
                    confirm: () => {
                        this.lock.delChat = false;
                        this.$api.ModelController.deleteChat(item.chatId)
                            .then((res) => {
                                if (res.code === 200) {
                                    this.getChats();
                                    if (
                                        this.$route.params.chatid ===
                                        item.chatId
                                    ) {
                                        this.navChoosen = [];
                                        this.$Go(`/chat`);
                                    }
                                    this.lock.delChat = true;
                                }
                            })
                            .catch((e) => {
                                if (e.message)
                                    this.$barWarning(e.message, {
                                        status: 'error'
                                    });
                                this.lock.delChat = true;
                            });
                    },
                    cancel: () => {}
                }
            );
        },
        getRouteChoosen() {
            let chatid = this.$route.params.chatid;
            if (chatid) {
                let index = this.chatList.findIndex((x) => x.chatId === chatid);
                if (index !== -1) {
                    this.navChoosen = [this.chatList[index]];
                } else this.navChoosen = [];
            }
        },
        itemClick($event) {
            if (window.innerWidth <= 768) this.show.globalNav = false;
            this.$Go(`/chat/${$event.item.chatId}`);
        },
        rightClick($event, item) {
            $event.preventDefault();
            $event.stopPropagation();
            this.rightMenuItem = item;
            this.$refs.rightMenu.rightClick($event, this.$el);
        },
        outsideClickEvent(event) {
            let x = event.target;
            let _self = false;
            while (x && x.tagName && x.tagName.toLowerCase() != 'body') {
                if (
                    [...x.classList].includes('new-chat-info-block') ||
                    [...x.classList].includes('navigation-view-mode-block')
                ) {
                    _self = true;
                    break;
                }
                x = x.parentNode;
            }
            if (!_self) this.show.newChat = false;
        }
    },
    beforeDestroy() {}
};
</script>

<style lang="scss">
.nav-block {
    @include HcenterVcenterC;

    position: relative;
    width: 300px;
    height: 100%;
    padding-top: 50px;
    background: rgba(255, 255, 255, 1);
    border-right: rgba(200, 200, 200, 0.1) solid thin;

    &.hidden {
       .global-nav-button {
            left: 120px;
        }
    }

    &.dark {
        background: linear-gradient(
            125deg,
            rgba(57, 28, 81, 1),
            rgba(16, 24, 40, 1),
            rgba(16, 24, 40, 1)
        );

        .img-icon {
            filter: grayscale(1) brightness(1.8);
        }

        .global-nav-button {
            color: whitesmoke;
            transition: all 0.3s;

            &:hover {
                background: rgba(200, 200, 200, 0.1);
            }

            &:active {
                background: rgba(100, 100, 100, 0.1);
            }
        }

        .new-chat-info-block {
            background: rgba(0, 0, 0, 0.8);
        }
    }

    &.hidden {
        width: 0px;

        .navigation-view-mode-block {
            display: none;
        }
    }

    .img-icon {
        width: 16px;
        height: 16px;
        user-select: none;
    }

    .local-empty-block {
        @include HcenterVcenter;

        position: relative;
        width: 100%;
        height: 50px;
    }

    .global-nav-button {
        @include HcenterVcenter;

        position: fixed;
        left: 260px;
        top: 8px;
        flex-shrink: 0;
        z-index: 2;

        &:hover {
            background: rgba(120, 120, 120, 0.1);
        }

        &:active {
            background: rgba(100, 100, 100, 0.1);
        }
    }

    .navigation-view-mode-block {
        position: relative;
        width: calc(100% - 10px);
        height: 60px;
        padding: 8px 15px;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        transition: all 0.6s;
        user-select: none;

        &:hover {
            background: rgba(200, 200, 200, 0.1);

            .navigation-view-mode-right-block {
                opacity: 1;
            }
        }

        &:active {
            background: rgba(200, 200, 200, 0.3);
        }

        &.dark {
            color: rgba(245, 245, 245, 0.8);
        }

        .navigation-view-mode-left-block {
            @include Vcenter;

            flex: 1;
        }

        .navigation-view-mode-right-block {
            @include HendVcenter;

            width: 100px;
            opacity: 0;
            transition: all 0.3s;

            .more-menu-btn {
                @include HcenterVcenter;

                width: 25px;
                height: 25px;
                font-size: 12px;
                border-radius: 8px;

                &:hover {
                    background: rgba(200, 200, 200, 0.2);
                }

                &:active {
                    background: rgba(200, 200, 200, 0.3);
                }
            }
        }

        .title {
            margin-left: 15px;
            font-weight: bold;
            color: rgba(255, 180, 0, 1);
        }
    }

    .new-chat-info-block {
        @include HcenterC;

        position: relative;
        width: calc(100% - 10px);
        padding: 8px 15px;
        background: rgba(245, 245, 245, 1);
        border-radius: 6px;
        line-height: 2;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);

        .combobox-custom-content {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .main-title {
                font-size: 13.8px;
                font-weight: bold;
            }

            .info-block {
                @include HbetweenVcenter;

                .max-len {
                    font-size: 12px;
                    color: rgba(90, 90, 90, 1);
                    transform: scale(0.8);
                    transform-origin: 0% 50%;
                }

                .price-block {
                    @include Vcenter;

                    font-size: 12px;
                    color: rgba(90, 90, 90, 1);
                    transform: scale(0.8);

                    i {
                        color: rgba(0, 204, 153, 1);
                    }
                }
            }
        }
    }

    .list-view-custom-item {
        @include Vcenter;

        position: relative;
        width: 100%;
        height: 100%;
        padding-left: 10px;

        &:hover {
            .list-view-control {
                opacity: 1;
            }
        }

        .list-view-control {
            @include Vcenter;

            position: relative;
            width: auto;
            height: 100%;
            right: 0px;
            margin-left: 5px;
            opacity: 0;
        }
    }

    .icon-img {
        width: 16px;
        height: auto;
        user-select: none;
    }

    .foldder-enter-active,
    .foldder-leave-active {
        transition: all 0.3s ease-out;
        transform-origin: 50% 0%;
        overflow: hidden;
    }

    .foldder-enter {
        height: 0px;
        opacity: 0;
    }

    .foldder-leave-to {
        height: 0px;
        opacity: 0;
    }

    .foldder-enter-to {
        height: 161px;
        opacity: 1;
    }

    .foldder-leave {
        height: 161px;
        opacity: 1;
    }
}

@media screen and (max-width: 768px) {
    .nav-block {
        position: absolute;
        width: 100%;
        z-index: 2;

        &.hidden {
            width: 0px;

            .global-nav-button {
                left: 260px;
            }
        }

        .global-nav-button {
            left: 20px;
            transition: all 0.3s;
            z-index: 3;
        }

        .list-view-custom-item {
            .list-view-control {
                opacity: 1;
            }
        }
    }
}
</style>