<template>
    <div
        class="las-playground-container"
        :class="[{collapse: show.collapse}]"
    >
        <div class="las-playground-left-container">
            <div class="las-playground-row block">
                <i class="ms-Icon ms-Icon--Robot"></i>
                <p
                    class="las-playground-main-title"
                    style="margin-left: 15px;"
                >{{basic.info.server_name}}</p>
            </div>
            <span
                class="las-playground-small-title"
                style="margin-left: 20px;"
            >{{local('Connect to Server')}}</span>
            <div class="las-playground-row">
                <fv-text-box
                    v-model="basic.host"
                    :prefix="'Url'"
                    :reveal-border="true"
                    :border-width="2"
                    :border-radius="8"
                    style="height: 45px; flex: 1;"
                ></fv-text-box>
                <fv-text-box
                    v-model="basic.port"
                    :prefix="'Port'"
                    :reveal-border="true"
                    :border-width="2"
                    :border-radius="8"
                    style="width: 120px; height: 45px; margin-left: 5px;"
                ></fv-text-box>
            </div>
            <div class="las-playground-row">
                <fv-text-box
                    v-model="basic.api_key"
                    :prefix="'API_KEY'"
                    :reveal-border="true"
                    :border-width="2"
                    :border-radius="8"
                    style="width: 120px; height: 45px; flex: 1;"
                ></fv-text-box>
                <fv-button
                    theme="dark"
                    :background="gradient"
                    :disabled="!basic.host || !basic.port"
                    style="width: 120px; height: 35px; margin-left: 5px;"
                    @click="connect"
                >{{local('Test Connection')}}</fv-button>
            </div>
            <span
                class="las-playground-small-title"
                style="margin-left: 20px;"
            >{{local('Instructions')}}</span>
            <power-editor
                :placeholder="local('You are a helpful assistant.')"
                class="las-playground-instruction-editor-block"
                ref="instruction"
                :editorOutSideBackground="'white'"
                editorBackground="transparent"
            ></power-editor>
        </div>
        <div class="las-playground-mobile-nav">
            <fv-button
                style="width: 35px; height: 35px;"
                @click="show.collapse ^= true"
            >
                <i
                    class="ms-Icon"
                    :class="[`ms-Icon--${show.collapse ? 'ChevronRight' : 'ChevronLeft'}`]"
                ></i>
            </fv-button>
        </div>
        <div class="las-playground-right-container">
            <div class="history-container">
                <msg-item
                    v-for="(item, index) in history"
                    :value="item"
                    :key="index"
                    :loading="index === history.length - 1 && !lock.submit"
                    :lock="lock.submit"
                    @regenerate="regenerateChat($event, item, index)"
                ></msg-item>
            </div>
            <div
                class="editor-block"
                :class="[{'full-screen': fullScreenEditor}]"
            >
                <fv-button
                    v-show="findLastUserChatIndex() > -1"
                    icon="Refresh"
                    :is-box-shadow="true"
                    :disabled="!lock.create || !lock.submit"
                    style="position: absolute; top: -50px; width: 200px;"
                    @click="regenerateChat"
                >{{local('Regenerate Response')}}</fv-button>
                <div class="editor-margin-wrapper">
                    <power-editor
                        :placeholder="local(`Ask me anything (Press Ctrl + Enter)`)"
                        class="power-editor-block"
                        ref="editor"
                        :showToolBar="fullScreenEditor"
                        :editorOutSideBackground="'white'"
                        :editablePaddingBottom="fullScreenEditor ? 315 : 0"
                        style="height: 100%; flex: 1;"
                    ></power-editor>
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
                        :disabled="!lock.create || !lock.submit || !serverReady"
                        style="margin-left: 5px;"
                        @click="createChat(history)"
                    >{{local('Submit')}}</fv-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import axios from 'axios';

import msgItem from '@/components/manage/playground/msgItem.vue';

let ax = axios.create();
export default {
    components: {
        msgItem
    },
    data() {
        return {
            basic: {
                host: '',
                port: '80',
                api_key: '',
                info: {
                    server_name: 'Unconnected'
                }
            },
            stream_id: '',
            history: [],
            eventSource: null,
            fullScreenEditor: false,
            show: {
                collapse: false
            },
            lock: {
                create: true,
                submit: true
            }
        };
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        serverReady() {
            return this.basic.host && this.basic.port;
        }
    },
    mounted() {
        this.ShortCutInit();
    },
    methods: {
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
                this.createChat(this.history);
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
        async connect() {
            let { host, port } = this.basic;
            let url = `http://${host}:${port}/`;
            try {
                let res = await ax.get(url);
                if (res.data.code === 200) this.basic.info = res.data.data;
            } catch (e) {
                this.$barWarning(e, {
                    status: 'warning'
                });
            }
        },
        async createChat(history, last_query = null) {
            if (!this.lock.create) return;
            let query = last_query
                ? last_query
                : this.$refs.editor.saveMarkdown();
            if (!query.replace(/[\s]/g, '')) {
                this.$barWarning(this.local('Content is empty.'), {
                    status: 'warning'
                });
                return;
            }
            this.lock.create = false;
            let { host, port, api_key } = this.basic;
            let url = `http://${host}:${port}/create_stream`;
            let instruction = this.$refs.instruction.saveMarkdown();
            instruction = instruction.replace(/[\r\n]/g, '');
            if (instruction && history.length === 0)
                history = [
                    {
                        role: 'system',
                        content: instruction
                    }
                ];
            ax.post(
                url,
                {
                    query,
                    history: history
                },
                {
                    headers: {
                        'api-key': api_key
                    }
                }
            )
                .then((res) => {
                    if (res.data.code === 200) {
                        this.$refs.editor.editor.commands.setContent('');
                        this.stream_id = res.data.data.stream_id;
                        history.push(
                            {
                                role: 'user',
                                content: query
                            },
                            {
                                role: 'assistant',
                                content: ''
                            }
                        );
                        this.history = history;
                        this.addReceiveMsg();
                    } else {
                        this.$barWarning(res.data.message, {
                            status: 'warning'
                        });
                    }
                    this.lock.create = true;
                })
                .catch((e) => {
                    this.$barWarning(e, {
                        status: 'warning'
                    });
                    this.lock.create = true;
                });
        },
        addReceiveMsg() {
            if (!this.stream_id) return;
            if (this.eventSource) this.eventSource.close();
            let { host, port, api_key } = this.basic;
            if (!host.startsWith('http')) host = 'http://' + host;
            this.eventSource = new EventSource(
                `${host}:${port}/chat_stream?stream_id=${this.stream_id}&api_key=${api_key}`
            );
            this.lock.submit = false;
            this.eventSource.addEventListener('message', (event) => {
                let res = JSON.parse(event.data);
                if (res.code === 200) {
                    let lastIndex = this.history.length - 1;
                    let msgItem = this.history[lastIndex];
                    msgItem.content = res.data.answer;
                    this.$set(this.history, lastIndex, msgItem);
                    if (res.data.status === 'finished') this.lock.submit = true;
                } else {
                    this.$barWarning(res.message, {
                        status: 'warning'
                    });
                    this.lock.submit = true;
                }
            });
            this.eventSource.addEventListener('error', (error) => {
                // console.log(error);
                this.eventSource.close();
                this.lock.submit = true;
            });
        },
        findLastUserChatIndex() {
            let lastIndex = this.history.length - 1;
            for (let i = lastIndex; i >= 0; i--) {
                if (this.history[i].role === 'user') return i;
            }
            return -1;
        },
        regenerateChat(content = null, item = null, index = null) {
            if (!item || !index) {
                let lastIndex = this.findLastUserChatIndex();
                if (lastIndex === -1) return;
                let lastChatContent = this.history[lastIndex].content;
                this.history = this.history.slice(0, lastIndex);
                this.createChat(this.history, lastChatContent);
            } else {
                if (item.role === 'user') {
                    this.history = this.history.slice(0, index);
                    this.createChat(this.history, content);
                } else {
                    if (index === 0) return;
                    index = index - 1;
                    let lastContent = this.history[index].content;
                    this.history = this.history.slice(0, index);
                    this.createChat(this.history, lastContent);
                }
            }
        }
    }
};
</script>

<style lang="scss">
.las-playground-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 1;

    .las-playground-left-container {
        position: relative;
        width: 450px;
        height: 100%;
        padding: 15px 0px;
        border-right: rgba(120, 120, 120, 0.1) solid thin;
        line-height: 2;
        display: flex;
        flex-direction: column;

        .las-playground-row {
            @include Vcenter;

            position: relative;
            width: calc(100% - 10px);
            height: auto;
            margin: 0px 5px;
            padding: 15px;

            &.block {
                border-radius: 8px;

                &:hover {
                    background: rgba(236, 236, 241, 1);
                }
            }
        }

        .las-playground-instruction-editor-block {
            width: calc(100% - 40px);
            margin: 5px 20px;
            border: rgba(120, 120, 120, 0.2) solid thin;
            overflow: hidden;
        }
    }

    .las-playground-right-container {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;

        .history-container {
            @include HcenterC;

            position: relative;
            width: 100%;
            height: 100%;
            flex: 1;
            padding-bottom: 80px;
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
            }
        }
    }

    .las-playground-mobile-nav {
        position: fixed;
        right: 0px;
        top: 55px;
        display: none;
        transition: all 0.3s;
        z-index: 3;
    }

    .las-playground-main-title {
        font-size: 16px;
        font-weight: bold;
    }

    .las-playground-small-title {
        font-size: 12px;
        font-weight: bold;
    }
}

@media screen and (max-width: 768px) {
    .las-playground-container {
        .las-playground-left-container {
            width: 100%;
        }

        .las-playground-right-container {
            display: none;
        }

        .las-playground-mobile-nav {
            display: flex;
        }

        &.collapse {
            .las-playground-left-container {
                display: none;
            }

            .las-playground-right-container {
                display: flex;
            }

            .las-playground-mobile-nav {
                right: calc(100% - 35px);
            }
        }
    }
}
</style>