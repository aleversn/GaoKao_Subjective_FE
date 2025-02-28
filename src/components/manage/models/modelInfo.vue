<template>
    <fv-panel
        v-model="thisValue"
        :title="local('Model Info')"
        width="450px"
        height="1200px"
        background="rgba(255, 255, 255, 0.6)"
        title-size="13.8"
        :is-central-side="true"
        :is-acrylic="true"
        :is-footer="true"
    >
        <template v-slot:container>
            <div class="model-panel-container">
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('ID')}}</p>
                </div>
                <div class="panel-row">
                    <p class="panel-info-content">{{model.id}}</p>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model ID')}}</p>
                </div>
                <div class="panel-row">
                    <p class="panel-info-content">{{model.modelId}}</p>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model Avatar')}}</p>
                </div>
                <div class="panel-row">
                    <div style="width: 100%; display: flex; flex-direction: column">
                        <fv-persona
                            :src="avatar ? avatar : img.logo"
                            size="60"
                            background="rgba(245, 245, 245, 1)"
                            @click.native="show.avatar ^= true"
                        >
                        </fv-persona>
                    </div>
                </div>
                <transition :name="show.avatar ? 'rotate-fold-top-to-bottom' : 'rotate-fold-bottom-to-top'">
                    <div
                        v-show="show.avatar"
                        class="panel-row"
                    >
                        <choose-avatar
                            ref="avatar"
                            @update-base64="avatar = $event"
                        >
                        </choose-avatar>
                    </div>
                </transition>
                <div
                    v-show="show.avatar"
                    class="panel-row"
                    style="justify-content: center"
                >
                    <fv-button
                        :is-box-shadow="true"
                        style="width: 120px; margin-left: 5px"
                        @click="show.avatar = false"
                    >{{local('Close')}}</fv-button>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Max Len')}}</p>
                </div>
                <div class="panel-row">
                    <fv-tag :value="model.maxLength ? [{text: model.maxLength}]: []"></fv-tag>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Prompt Price')}}</p>
                </div>
                <div class="panel-row">
                    <fv-tag :value="getPrice(model.promptPrice) ? [{text: getPrice(model.promptPrice), background: color}]: []"></fv-tag>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Completion Price')}}</p>
                </div>
                <div class="panel-row">
                    <fv-tag :value="getPrice(model.completionPrice) ? [{text: getPrice(model.completionPrice), background: color}]: []"></fv-tag>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model Type')}}</p>
                </div>
                <div class="panel-row">
                    <fv-tag :value="otherInfo.modelType ? [{text: otherInfo.modelType}]: []"></fv-tag>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Welcome Remark')}}</p>
                </div>
                <div class="panel-row">
                    <fv-text-field
                        v-model="welcome"
                        :placeholder="local('Welcome Remark')"
                        class="panel-text-field"
                    ></fv-text-field>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('End Remark')}}</p>
                </div>
                <div class="panel-row">
                    <fv-text-field
                        v-model="goodbye"
                        :placeholder="local('End Remark')"
                        class="panel-text-field"
                    ></fv-text-field>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model Nickname')}}</p>
                </div>
                <div class="panel-row">
                    <fv-text-box
                        v-model="nickname"
                        :placeholder="local('Model Nickname')"
                        underline
                        :border-width="2"
                        :border-color="'rgba(120, 120, 120, 0.1)'"
                        :focus-border-color="color"
                        :is-box-shadow="true"
                    ></fv-text-box>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model Title')}}</p>
                </div>
                <div class="panel-row">
                    <fv-text-box
                        v-model="title"
                        :placeholder="local('Model Title')"
                        underline
                        :border-width="2"
                        :border-color="'rgba(120, 120, 120, 0.1)'"
                        :focus-border-color="color"
                        :is-box-shadow="true"
                    ></fv-text-box>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Model Chat Background')}}</p>
                </div>
                <div
                    class="background-panel-row"
                    @click="$refs.backgroundInput.click()"
                >
                    <img
                        v-show="background"
                        draggable="false"
                        :src="background"
                        alt=""
                    >
                    <input
                        v-show="false"
                        type="file"
                        ref="backgroundInput"
                        accept="*.jpg, *.jpeg, *.png, *.svg"
                        @change="selectBackground"
                    >
                </div>
                <div
                    class="panel-row"
                    style="justify-content: center"
                >
                    <fv-button
                        :is-box-shadow="true"
                        style="width: 120px; margin-left: 5px"
                        @click="background = null"
                    >{{local('Clear Background')}}</fv-button>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Enable Quick Instruction')}}</p>
                </div>
                <div class="panel-row">
                    <fv-toggle-switch
                        v-model="enableQuickCommand"
                        :width="80"
                        :height="30"
                        :switch-on-background="color"
                        :on="local('Yes')"
                        :off="local('No')"
                        :inside-content="true"
                    ></fv-toggle-switch>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Always Show Quick Instruction')}}</p>
                </div>
                <div class="panel-row">
                    <fv-toggle-switch
                        v-model="alwayShowQuickCommand"
                        :width="80"
                        :height="30"
                        :switch-on-background="color"
                        :on="local('Yes')"
                        :off="local('No')"
                        :inside-content="true"
                    ></fv-toggle-switch>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Enable Voice Input')}}</p>
                </div>
                <div class="panel-row">
                    <fv-toggle-switch
                        v-model="enableSpeechInput"
                        :width="80"
                        :height="30"
                        :switch-on-background="color"
                        :on="local('Yes')"
                        :off="local('No')"
                        :inside-content="true"
                    ></fv-toggle-switch>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Enable Digital Human')}}</p>
                </div>
                <div class="panel-row">
                    <fv-toggle-switch
                        v-model="enableDigitalHuman"
                        :width="80"
                        :height="30"
                        :switch-on-background="color"
                        :on="local('Yes')"
                        :off="local('No')"
                        :inside-content="true"
                    ></fv-toggle-switch>
                </div>
                <div
                    class="panel-row"
                    style="margin-top: 15px;"
                >
                    <p class="panel-title">{{local('Comment Mode')}}</p>
                </div>
                <div class="panel-row">
                    <fv-toggle-switch
                        v-model="expandComment"
                        :width="80"
                        :height="30"
                        :switch-on-background="color"
                        :on="local('Visible')"
                        :off="local('Collapse')"
                        :inside-content="true"
                    ></fv-toggle-switch>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <fv-button
                theme="dark"
                :background="color"
                :disabled="!lock.update"
                style="width: 120px; margin-left: 5px"
                @click="updateModelOtherInfo"
            >{{local('Revise')}}</fv-button>
            <fv-button
                style="width: 120px; margin-left: 5px"
                @click="thisValue = false"
            >{{local('Cancel')}}</fv-button>
        </template>
    </fv-panel>
</template>

<script>
import { mapGetters } from 'vuex';

import chooseAvatar from '@/components/general/profile/chooseAvatar.vue';

import logo from '@/assets/logo.svg';

export default {
    components: {
        chooseAvatar
    },
    props: {
        value: {
            default: false
        },
        model: {
            default: () => ({})
        }
    },
    data() {
        return {
            thisValue: this.value,
            otherInfo: {},
            welcome: '',
            goodbye: '',
            enableQuickCommand: false,
            enableSpeechInput: false,
            enableDigitalHuman: false,
            expandComment: false,
            nickname: '',
            title: '',
            avatar: null,
            background: null,
            alwayShowQuickCommand: false,
            img: {
                logo,
                cuttingAvatar: null
            },
            show: {
                avatar: false
            },
            lock: {
                update: true
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
        },
        thisValue(val) {
            this.$emit('input', val);
        },
        model() {
            this.getModelOtherInfo();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        getPrice() {
            return (item) => {
                if (!item) return this.local('Free');
                return '￥' + item;
            };
        }
    },
    mounted() {},
    methods: {
        getModelOtherInfo() {
            if (!this.model.id) return;
            this.$api.ModelController.getModelById(this.model.id).then(
                (res) => {
                    if (res.code === 200) {
                        this.otherInfo = res.data;
                        try {
                            let params = JSON.parse(this.otherInfo.params);
                            this.welcome = params.welcome;
                            this.goodbye = params.goodbye;
                            this.enableQuickCommand = params.enableQuickCommand
                                ? params.enableQuickCommand
                                : false;
                            this.enableSpeechInput = params.enableSpeechInput
                                ? params.enableSpeechInput
                                : false;
                            this.enableDigitalHuman = params.enableDigitalHuman
                                ? params.enableDigitalHuman
                                : false;
                            this.expandComment = params.expandComment
                                ? params.expandComment
                                : false;
                            this.nickname = params.nickname;
                            this.title = params.title;
                            this.avatar = params.avatar;
                            this.background = params.background;
                            this.alwayShowQuickCommand =
                                params.alwayShowQuickCommand;
                        } catch (e) {
                            this.welcome = '';
                            this.goodbye = '';
                            this.enableQuickCommand = false;
                            this.enableSpeechInput = false;
                            this.enableDigitalHuman = false;
                            this.expandComment = false;
                            this.nickname = '';
                            this.title = '';
                            this.avatar = null;
                            this.background = null;
                            this.alwayShowQuickCommand = false;
                        }
                    }
                }
            );
        },
        updateModelOtherInfo() {
            if (!this.model.id) return;
            if (!this.lock.update) return;
            this.lock.update = false;
            let params = {
                welcome: this.welcome,
                goodbye: this.goodbye,
                enableQuickCommand: this.enableQuickCommand,
                enableSpeechInput: this.enableSpeechInput,
                enableDigitalHuman: this.enableDigitalHuman,
                expandComment: this.expandComment,
                nickname: this.nickname,
                title: this.title,
                avatar: this.avatar,
                background: this.background,
                alwayShowQuickCommand: this.alwayShowQuickCommand
            };
            this.$api.ModelController.updateModel(this.model.id, params)
                .then((res) => {
                    if (res.code === 200) {
                        this.thisValue = false;
                        this.$barWarning(this.local('Update Success'), {
                            status: 'correct'
                        });
                    }
                    this.lock.update = true;
                })
                .catch((err) => {
                    this.lock.update = true;
                    this.$barWarning(this.local('Update Failed') + err, {
                        status: 'error'
                    });
                });
        },
        selectBackground() {
            let blob = this.$refs.backgroundInput.files[0];
            this.blobToBase64(blob, (base64) => {
                this.background = base64;
                this.$refs.backgroundInput.value = '';
            });
        },
        blobToBase64(blob, callback) {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
                var dataUrl = reader.result;
                callback(dataUrl);
            };
        }
    }
};
</script>

<style lang="scss">
.model-panel-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px 15px 55px 15px;
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    font-weight: 400;
    line-height: 2;
    overflow: overlay;

    .panel-title {
        font-size: 12px;
    }

    .panel-row {
        position: relative;
        margin: 5px 0px;
        padding: 0px 5px;
        display: flex;
        align-items: center;

        .panel-title {
            font-size: 15px;
            font-weight: bold;
        }

        .panel-info-content {
            font-size: 15px;
            font-weight: 400;
        }

        .panel-text-field {
            position: relative;
            width: 100%;
            height: 80px;
        }
    }

    .background-panel-row {
        position: relative;
        width: 100%;
        height: 150px;
        background: rgba(245, 245, 245, 1);
        border-radius: 6px;
        transition: all 0.1s;
        overflow: hidden;

        &:hover {
            opacity: 0.6;
        }

        &:active {
            opacity: 0.9;
        }

        img {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            object-fit: cover;
        }
    }
}
</style>