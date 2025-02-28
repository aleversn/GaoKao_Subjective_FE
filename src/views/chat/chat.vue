<template>
    <div
        class="main-chat-container"
        :class="[{dark: theme === 'dark'}]"
    >
        <nav-block
            :local="local"
            ref="nav"
        ></nav-block>
        <div class="chat-container">
            <img
                v-show="otherInfo.background"
                draggable="false"
                class="model-chat-background"
                :src="otherInfo.background"
                alt=""
            >
            <div
                v-show="otherInfo.title"
                class="model-title-block"
            >
                <div class="model-title">
                    {{otherInfo.title}}
                </div>
            </div>
            <div
                v-show="msgList.length > 0"
                ref="scroller"
                class="all-chat-list"
            >
                <msg-block
                    v-if="otherInfo.welcome"
                    :value="otherInfo.welcomeBody"
                    :holdon="holdon"
                    :showFeedback="false"
                    :showReader="otherInfo.enableDigitalHuman"
                    :nickname="otherInfo.nickname"
                    :modelAvatar="otherInfo.avatar"
                    style="margin-top: 80px;"
                    @read-context="ttsStart"
                ></msg-block>
                <chat-block
                    :value="treeList"
                    ref="chat"
                    :holdon="holdon"
                    :showReader="otherInfo.enableDigitalHuman"
                    :nickname="otherInfo.nickname"
                    :modelAvatar="otherInfo.avatar"
                    :visibleFeedback="otherInfo.expandComment"
                    @revise-submit="reviseSubmitMsg"
                    @read-context="ttsStart"
                ></chat-block>
            </div>
            <chat-empty
                v-show="msgList.length === 0"
                style="height: 10px; flex: 1;"
            ></chat-empty>
            <div
                class="editor-block"
                :class="[{'full-screen': fullScreenEditor}]"
            >
                <fv-button
                    v-show="getLastMsg('user')"
                    theme="dark"
                    icon="Refresh"
                    :background="color"
                    :is-box-shadow="true"
                    :disabled="holdon"
                    style="position: absolute; top: -50px; width: 200px;"
                    @click="reSubmitMsg"
                >{{local('Regenerate Response')}}</fv-button>
                <div class="editor-margin-wrapper">
                    <power-editor
                        :placeholder="local(`Ask me anything (Press Ctrl + Enter)`)"
                        :theme="theme"
                        class="power-editor-block"
                        ref="editor"
                        :editable="chatId != undefined && !speech.active"
                        :showToolBar="fullScreenEditor"
                        :editorBackground="theme === 'dark' ? 'rgba(52, 64, 84, 1)' : 'white'"
                        :editorOutSideBackground="theme === 'dark' ? 'rgba(52, 64, 84, 1)' : 'white'"
                        :editablePaddingBottom="fullScreenEditor ? 315 : 0"
                        :imgInterceptor="imgInterceptor"
                        style="height: 100%; flex: 1;"
                    ></power-editor>
                    <audio-wave
                        v-if="speech.active"
                        class="las-chat-input-audio-wave"
                        :speed="speech.speed"
                        :amplitude="speech.amplitude"
                    ></audio-wave>
                    <fv-button
                        :border-radius="50"
                        :is-box-shadow="true"
                        style="position: absolute; width: 30px; height: 30px; bottom: 6px; right: 100px;"
                        @click="fullScreenEditor = !fullScreenEditor"
                    >
                        <i
                            class="ms-Icon"
                            :class="[`ms-Icon--${fullScreenEditor ? 'BackToWindow' : 'FullScreen'}`]"
                        ></i>
                    </fv-button>
                    <fv-button
                        theme="dark"
                        class="editor-submit-button"
                        :background="color"
                        :disabled="holdon"
                        style="margin-left: 5px;"
                        @click="createMsg"
                    >{{local('Submit')}}</fv-button>
                    <fv-button
                        v-if="otherInfo.enableSpeechInput"
                        theme="dark"
                        class="editor-submit-button"
                        :border-radius="50"
                        :background="gradient"
                        :disabled="holdon"
                        style="position: absolute; width: 30px; height: 30px; bottom: 6px; left: 10px;"
                        @click="voiceClick"
                    >
                        <i
                            class="ms-Icon"
                            :class="[`ms-Icon--${speech.active ? 'MicOff2' : 'MicOn'}`]"
                        ></i>
                    </fv-button>
                </div>
            </div>
            <cute-robot
                v-if="otherInfo.enableDigitalHuman"
                ref="robot"
                :size="clientWidth * 0.15"
                :active.sync="speech.ttsActive"
                :welcome="otherInfo.welcome"
                :context.sync="speech.ttsText"
                @robot-click="voiceClick"
            ></cute-robot>
            <fv-resize-watcher
                :target="() => $el"
                @watch="clientWidth = $el.clientWidth"
            ></fv-resize-watcher>
            <fv-button
                v-show="!show.quickInstruction && otherInfo.enableQuickCommand && !alwaysShowQuickInstruction"
                :theme="theme"
                class="quick-insturction-btn"
                :border-radius="6"
                :foreground="color"
                :background="theme === 'dark' ? 'rgba(52, 64, 84, 0.8)' : 'white'"
                :is-box-shadow="true"
                @click="show.quickInstruction = true"
            >
                <div class="quick-instruction-btn-content">
                    <i
                        class="ms-Icon"
                        :class="[`ms-Icon--LightningBolt`]"
                    ></i>
                    <p class="title">{{local('Quick Instruction')}}</p>
                </div>
            </fv-button>
        </div>
        <stt-tool
            ref="stt"
            :speed.sync="speech.speed"
            :amplitude.sync="speech.amplitude"
            :active.sync="speech.active"
            :lock.sync="speech.sttLock"
            :createMsg="createMsg"
            @insert-text="$refs.editor.insertMarkdown($event)"
        ></stt-tool>
        <quick-instruction
            v-model="show.quickInstruction"
            :alwaysShow="alwaysShowQuickInstruction"
            :quickQuestions="quickQuestions"
            @quick-context="quickInstructionClick($event)"
            @quick-edit="quickInstructionClick($event, true)"
        ></quick-instruction>
    </div>
</template>

<script>
import navBlock from '@/components/chat/nav.vue';
import msgBlock from '@/components/chat/msgBlock';
import chatBlock from '@/components/chat/chatBlock.vue';
import chatEmpty from '@/components/general/empty/chatEmpty.vue';
import audioWave from '@/components/chat/audioTool/audioWave.vue';
import cuteRobot from '@/components/chat/cuteRobot';
import sttTool from '@/components/chat/audioTool/sttTool.vue';
import quickInstruction from '@/components/chat/quickInstruction';

import msgItemBody from './msgItem';

import { mapGetters, mapMutations } from 'vuex';

export default {
    components: {
        navBlock,
        msgBlock,
        chatBlock,
        chatEmpty,
        audioWave,
        cuteRobot,
        sttTool,
        quickInstruction
    },
    data() {
        return {
            otherInfo: {
                modelId: '',
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
                welcomeBody: {}
            },
            msgList: [],
            treeList: {
                chatId: null,
                messageId: 'root',
                children: [],
                childIdx: 0,
                updatedAt: JSON.stringify(new Date())
            },
            queueFunction: [],
            eventSource: null,
            fullScreenEditor: false,
            speech: {
                speed: 0.2,
                amplitude: 0,
                active: false,
                sttLock: true,
                ttsActive: false,
                ttsText: ''
            },
            quickQuestions: [],
            clientWidth: 0,
            show: {
                quickInstruction: false
            },
            lock: {
                msg: true,
                submit: true,
                isQueueRunning: true
            }
        };
    },
    watch: {
        async $route() {
            if (this.eventSource) this.eventSource.close();
            await this.getChatOtherInfo();
            this.getMsgs();
            this.$refs.editor.editor.commands.setContent('');
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        async 'queueFunction.length'() {
            if (this.queueFunction.length === 0) return;
            if (!this.lock.isQueueRunning) return;
            this.lock.isQueueRunning = false;
            while (this.queueFunction.length > 0) {
                let func = this.queueFunction.shift();
                try {
                    await func();
                } catch (e) {
                    console.log(e);
                }
            }
            this.lock.isQueueRunning = true;
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        rootChildren() {
            return this.msgList.filter((msg) => !msg.parentId);
        },
        chatId() {
            return this.$route.params.chatid;
        },
        holdon() {
            return (
                !this.lock.msg ||
                !this.lock.submit ||
                !this.chatId ||
                !this.speech.sttLock ||
                this.speech.ttsActive
            );
        },
        alwaysShowQuickInstruction() {
            if (this.clientWidth < 1400) return false;
            return this.otherInfo.alwayShowQuickCommand;
        }
    },
    async mounted() {
        await this.getChatOtherInfo();
        this.getMsgs();
        this.ShortCutInit();
    },
    methods: {
        ...mapMutations('Model', {
            reviseInfo: 'reviseInfo'
        }),
        async getChatOtherInfo() {
            if (!this.chatId) return;
            await this.$api.ModelController.getChatById(this.chatId)
                .then((res) => {
                    try {
                        let params = res.data.model.params;
                        params = JSON.parse(params);
                        this.otherInfo.modelId = res.data.modelId;
                        this.otherInfo.welcome = params.welcome;
                        this.otherInfo.goodbye = params.goodbye;
                        this.otherInfo.enableQuickCommand =
                            params.enableQuickCommand
                                ? params.enableQuickCommand
                                : false;
                        this.otherInfo.enableSpeechInput =
                            params.enableSpeechInput
                                ? params.enableSpeechInput
                                : false;
                        this.otherInfo.enableDigitalHuman =
                            params.enableDigitalHuman
                                ? params.enableDigitalHuman
                                : false;
                        this.otherInfo.expandComment = params.expandComment
                            ? params.expandComment
                            : false;
                        this.otherInfo.nickname = params.nickname;
                        this.otherInfo.title = params.title;
                        this.otherInfo.avatar = params.avatar;
                        this.otherInfo.background = params.background;
                        this.otherInfo.alwayShowQuickCommand =
                            params.alwayShowQuickCommand;
                        let welcomeBody = Object.assign({}, msgItemBody);
                        welcomeBody.content = this.otherInfo.welcome;
                        this.otherInfo.welcomeBody = welcomeBody;
                    } catch (e) {
                        this.otherInfo.modelId = '';
                        this.otherInfo.welcome = '';
                        this.otherInfo.goodbye = '';
                        this.otherInfo.enableQuickCommand = false;
                        this.otherInfo.enableSpeechInput = false;
                        this.otherInfo.enableDigitalHuman = false;
                        this.otherInfo.expandComment = false;
                        this.otherInfo.nickname = '';
                        this.otherInfo.title = '';
                        this.otherInfo.avatar = null;
                        this.otherInfo.background = null;
                        this.otherInfo.alwayShowQuickCommand = false;
                    }
                    this.reviseInfo({
                        avatar: this.otherInfo.avatar,
                        nickname: this.otherInfo.nickname,
                        background: this.otherInfo.background
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            if (this.otherInfo.modelId && this.otherInfo.enableQuickCommand)
                this.$api.ModelController.listModelQuickQuestions(
                    this.otherInfo.modelId
                ).then((res) => {
                    if (res.code === 200) {
                        this.quickQuestions = res.data;
                    }
                });
        },
        getMsgs() {
            let chatId = this.chatId;
            if (!chatId) return;
            this.$api.ModelController.getMessages(chatId)
                .then((res) => {
                    if (res.code == 200) {
                        let msgList = res.data;
                        msgList.sort((a, b) => {
                            return (
                                new Date(b.updatedAt) - new Date(a.updatedAt)
                            );
                        });
                        for (let i = 0; i < msgList.length; i++) {
                            let parentId = msgList[i].messageId;
                            msgList[i].children = [];
                            msgList[i].childIdx = 0;
                            msgList[i].finished = 'finished';
                            this.goodbyeDecorator(msgList[i]);
                            for (let j = 0; j < msgList.length; j++) {
                                if (msgList[j].parentId == parentId) {
                                    msgList[i].children.push(msgList[j]);
                                }
                            }
                        }
                        this.msgList = msgList;
                        this.treeList.chatId = chatId;
                        this.treeList.children = this.rootChildren;
                    }
                })
                .catch((res) => {
                    if (res.message)
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                });
        },
        goodbyeDecorator(item) {
            if (this.otherInfo.goodbye && item.role === 'assistant')
                item.content = item.content + this.otherInfo.goodbye;
        },
        ShortCutInit() {
            this.$refs.editor.$el.addEventListener(
                'keydown',
                this.shortCutEvent
            );
        },
        shortCutEvent(event) {
            let ctrl = event.ctrlKey || event.metaKey;
            if (event.keyCode === 13 && ctrl) {
                event.preventDefault();
                this.createMsg();
            }

            if (event.keyCode === 9) {
                event.preventDefault();
                if (
                    this.$refs.editor.editor.isActive('bulletList') ||
                    this.$refs.editor.editor.isActive('orderedList')
                )
                    return;
                if (this.readonly) return;
                this.$refs.editor.editor.commands.insertContent('    ');
            }
        },
        async createMsg() {
            let chatId = this.chatId;
            if (!chatId) return;
            if (!this.lock.msg) return;
            let msg = this.$refs.editor.saveMarkdown();
            msg = msg.trim();
            if (msg === '') return;
            this.lock.msg = false;
            let lastMsg = this.getLastMsg();
            await this.$api.ModelController.createMessage(chatId, {
                role: 'user',
                content: msg,
                parentId: lastMsg ? lastMsg.messageId : null
            })
                .then((res) => {
                    this.$refs.editor.editor.commands.setContent('');
                    let newMsg = res.data;
                    newMsg.children = [];
                    newMsg.childIdx = 0;
                    newMsg.finished = 'finished';
                    this.msgList.unshift(newMsg);
                    if (lastMsg) {
                        lastMsg.children.unshift(newMsg);
                        lastMsg.childIdx = 0;
                        this.$set(
                            this.msgList,
                            this.msgList.indexOf(lastMsg),
                            lastMsg
                        );
                    } else this.treeList.children = this.rootChildren;
                    this.addReceiveMsg(newMsg.messageId);
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 300);
                })
                .catch((res) => {
                    if (res.message)
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                });
            this.lock.msg = true;
        },
        reSubmitMsg() {
            let lastMsg = this.getLastMsg('user');
            if (!lastMsg) return;
            if (lastMsg.finished === 'loading') return;
            this.addReceiveMsg(lastMsg.messageId);
        },
        async reviseSubmitMsg(event) {
            let chatId = this.chatId;
            if (!chatId) return;
            if (!this.lock.msg) return;
            this.lock.msg = false;
            let oriMsg = event.msg;
            let newContent = event.content;
            let parent = this.msgList.find(
                (msg) => msg.messageId === oriMsg.parentId
            );
            await this.$api.ModelController.createMessage(chatId, {
                role: 'user',
                content: newContent,
                parentId: parent ? parent.messageId : null
            })
                .then((res) => {
                    let newMsg = res.data;
                    newMsg.children = [];
                    newMsg.childIdx = 0;
                    newMsg.finished = 'finished';
                    this.msgList.unshift(newMsg);
                    if (parent) {
                        parent.children.unshift(newMsg);
                        parent.childIdx = 0;
                        this.$set(
                            this.msgList,
                            this.msgList.indexOf(parent),
                            parent
                        );
                    } else this.treeList.children = this.rootChildren;
                    this.addReceiveMsg(newMsg.messageId);
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 300);
                })
                .catch((res) => {
                    if (res.message) {
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                    }
                    this.lock.submit = true;
                });
            this.lock.msg = true;
        },
        addReceiveMsg(msgId) {
            let chatId = this.chatId;
            if (!chatId) return;
            let token = localStorage.getItem('ApiToken');
            if (!token) return;
            token = token.replace('Bearer ', '');
            if (this.eventSource) this.eventSource.close();
            this.eventSource = new EventSource(
                `${this.$server}/chats/${this.chatId}/messages/${msgId}/reply/stream?Authorization=${token}`
            );
            this.lock.submit = false;
            this.eventSource.addEventListener('message', (event) => {
                let data = JSON.parse(event.data);
                if (data.code) {
                    if (data.code === 40025) {
                        this.$barWarning(
                            this.local(
                                'Server Network Error, Please Try Again Later.'
                            ),
                            {
                                status: 'error'
                            }
                        );
                    } else if (data.code === 40032) {
                        this.$barWarning(
                            this.local(
                                'Insufficient balance, please recharge.'
                            ),
                            {
                                status: 'warning'
                            }
                        );
                    } else if (data.message)
                        this.$barWarning(data.message, {
                            status: 'error'
                        });
                    this.lock.submit = true;
                    return;
                }
                if (data.finished === 'length') {
                    this.$barWarning(
                        this.local(
                            `Current Chat has reached the max length, please choose better plan or create a new Chat.`
                        ),
                        {
                            status: 'warning'
                        }
                    );
                    this.lock.submit = true;
                }
                this.queueFunction.push(() => {
                    this.msgCallbackStream(data);
                });
            });
            this.eventSource.addEventListener('error', (error) => {
                // console.log(error);
                this.eventSource.close();
            });
        },
        msgCallbackStream(data) {
            let parent = this.msgList.find(
                (msg) => msg.messageId === data.parentId
            );
            let index = this.msgList.findIndex(
                (msg) => msg.messageId === data.messageId
            );
            let item = {
                ...data,
                content: data.delta,
                updatedAt: data.updatedAt
                    ? data.updatedAt
                    : JSON.stringify(new Date()),
                children: [],
                childIdx: 0,
                finished: 'loading'
            };
            if (index == -1) {
                this.msgList.push(item);
                index = this.msgList.indexOf(item);
                if (parent) {
                    parent.children.unshift(item);
                    parent.childIdx = 0;
                    this.$set(
                        this.msgList,
                        this.msgList.indexOf(parent),
                        parent
                    );
                } else this.treeList.children = this.rootChildren;
            } else {
                let oriItem = this.msgList[index];
                if (data.delta) oriItem.content = oriItem.content + data.delta;
                if (data.finished) {
                    oriItem.finished = data.finished;
                    this.goodbyeDecorator(oriItem);
                    this.ttsStart(oriItem.content);
                    this.lock.submit = true;
                }
                oriItem.updatedAt = data.updatedAt
                    ? data.updatedAt
                    : JSON.stringify(new Date());
                this.$set(this.msgList, index, oriItem);
            }
        },
        getLastMsg(role = 'any') {
            let result = null;
            let pointer = this.treeList.children[this.treeList.childIdx];
            while (pointer) {
                if (role === 'any') result = pointer;
                else if (pointer.role === role) {
                    result = pointer;
                }
                if (pointer.children.length === 0) break;
                pointer = pointer.children[pointer.childIdx];
            }
            return result;
        },
        scrollToBottom() {
            this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight;
            this.fullScreenEditor = false;
        },
        imgInterceptor({ deleteNode }) {
            this.$nextTick(() => {
                deleteNode();
            });
            this.$barWarning(
                this.local('Sorry, image is not supported in this chat.'),
                {
                    status: 'warning'
                }
            );
        },
        voiceClick() {
            if (this.holdon) return;
            if (this.speech.ttsActive) {
                return;
            }
            if (this.speech.active) {
                this.$refs.stt.stter.stopSpeech();
            } else {
                this.$refs.stt.stter.start();
                this.$refs.stt.stter.sttStart(this.$server);
            }
        },
        ttsStart(context) {
            this.speech.ttsText = '';
            this.speech.ttsText = context;
        },
        quickInstructionClick(context, edit = false) {
            this.$refs.editor.insertMarkdown(context);
            if (!edit) {
                this.createMsg();
            }
        }
    }
};
</script>

<style lang="scss">
.main-chat-container {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    background: rgba(248, 247, 252, 1);
    display: flex;
    overflow: hidden;

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

        .chat-container {
            .model-title-block {
                .model-title {
                    background: linear-gradient(
                        160deg,
                        rgba(39, 45, 89, 1),
                        rgba(49, 43, 86, 1),
                        rgba(30, 38, 53, 1)
                    );
                    color: rgba(245, 245, 245, 1);
                    box-shadow: 0px 1px 3px rgba(113, 82, 162, 0.1);
                }
            }
        }
    }

    .chat-container {
        position: relative;
        width: 10px;
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;

        .model-chat-background {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.1;
            z-index: 0;
        }

        .model-title-block {
            @include HcenterVcenter;

            position: absolute;
            left: 0px;
            top: 18px;
            width: 100%;
            height: 35px;
            z-index: 1;

            .model-title {
                @include HcenterVcenter;

                min-width: 30px;
                width: auto;
                height: 35px;
                padding: 0px 15px;
                background: rgba(255, 255, 255, 0.8);
                font-size: 18px;
                font-weight: bold;
                border-radius: 6px;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(50px);
                -webkit-backdrop-filter: blur(50px);
            }
        }

        .all-chat-list {
            position: relative;
            width: 100%;
            height: 10px;
            flex: 1;
            overflow: overlay;
        }

        .editor-block {
            position: relative;
            width: 100%;
            height: 150px;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-sizing: border-box;
            transition: all 0.3s;

            &.full-screen {
                height: 600px;
                max-height: 100%;
            }

            .editor-margin-wrapper {
                position: relative;
                width: 100%;
                max-width: 900px;
                height: 30px;
                flex: 1;
                margin-top: 15px;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                box-sizing: border-box;

                .power-editor-block {
                    border: rgba(200, 200, 200, 0.1) solid thin;
                    overflow: hidden;
                }

                .editor-submit-button {
                    position: absolute;
                    right: 12px;
                    bottom: 6px;
                }

                .las-chat-input-audio-wave {
                    position: absolute;
                    bottom: -30px;
                    left: 0;
                    width: calc(100% - 30px);
                    height: 150px;
                }
            }
        }

        .quick-insturction-btn {
            position: absolute;
            top: calc(50% - 50px);
            right: 0px;
            width: 80px;
            height: 80px;

            .quick-instruction-btn-content {
                @include HcenterVcenterC;

                position: relative;
                width: 100%;
                height: 100%;

                .title {
                    position: relative;
                    width: 100%;
                    margin-top: 5px;
                    font-size: 12px;
                    text-align: center;
                }
            }
        }
    }
}
</style>