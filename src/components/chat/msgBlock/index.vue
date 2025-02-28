<template>
    <div
        class="msg-block"
        :class="[{dark: theme === 'dark'}]"
    >
        <div
            class="msg-wrapper"
            :style="{background: thisValue.role === 'user' ? 'rgba(255, 255, 255, 0)' : ''}"
        >
            <div class="msg-role-block">
                <p
                    class="msg-guid"
                    :title="thisValue.messageId"
                >{{getRoleName}}</p>
            </div>
            <div class="msg-content-block">
                <div
                    v-if="thisValue.role === 'user'"
                    class="msg-role-block"
                    :style="{background: gradient}"
                >
                    <fv-persona
                        v-if="thisValue.role === 'user'"
                        :src="userInfo.avatar ? userInfo.avatar : ''"
                        size="35"
                        :name="userInfo.nickname"
                        @click.native="showAvatar = true"
                    ></fv-persona>
                </div>
                <div
                    v-else
                    class="msg-role-block"
                    :style="{background: gradient}"
                >
                    <img
                        v-show="!modelAvatar"
                        class="gpt-logo"
                        :src="img.gpt"
                        draggable="false"
                        alt=""
                    >
                    <img
                        v-show="modelAvatar"
                        class="model-avatar"
                        :src="modelAvatar"
                        draggable="false"
                        alt=""
                    >
                </div>
                <div
                    v-if="!editable"
                    v-html="mdHTML"
                    class="msg-content"
                >
                </div>
                <div
                    v-else
                    class="msg-editable-content-block"
                >
                    <power-editor
                        :placeholder="local('Edit your question...')"
                        :theme="theme"
                        class="msg-power-editor"
                        ref="editor"
                        :editorBackground="theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'"
                        :editorOutSideBackground="theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'"
                        @on-mounted="setEditorContent"
                    ></power-editor>
                    <div class="msg-editable-control-block">
                        <fv-button
                            theme="dark"
                            :background="gradient"
                            :is-box-shadow="true"
                            :disabled="holdon"
                            style="width: 120px;"
                            @click="getEditorContent"
                        >{{local('Submit')}}</fv-button>
                        <fv-button
                            :is-box-shadow="true"
                            style="margin-left: 15px; width: 120px;"
                            @click="editable = false"
                        >{{local('Cancel')}}</fv-button>
                    </div>
                </div>
            </div>
            <div class="msg-control-block">
                <div
                    v-show="versionTotal > 1"
                    class="msg-control-left-block"
                >
                    <fv-button
                        :theme="theme"
                        :background="theme === 'dark' ? 'rgba(50, 58, 71, 1)' : 'rgba(255, 255, 255, 1)'"
                        :border-radius="50"
                        style="width: 20px; height: 20px;"
                        @click="$emit('switch-version', 'prev')"
                    >
                        <i
                            class="ms-Icon ms-Icon--ChevronLeftMed"
                            style="font-size: 12px; transform: scale(0.8);"
                        ></i>
                    </fv-button>
                    <span class="version-display-block">
                        {{versionIdx + 1}} / {{versionTotal}}
                    </span>
                    <fv-button
                        :theme="theme"
                        :background="theme === 'dark' ? 'rgba(50, 58, 71, 1)' : 'rgba(255, 255, 255, 1)'"
                        :border-radius="50"
                        style="width: 20px; height: 20px;"
                        @click="$emit('switch-version', 'next')"
                    >
                        <i
                            class="ms-Icon ms-Icon--ChevronRightMed"
                            style="font-size: 12px; transform: scale(0.8);"
                        ></i>
                    </fv-button>
                </div>
                <div class="msg-control-right-block">
                    <fv-button
                        v-show="thisValue.role === 'user'"
                        :theme="theme"
                        :background="theme === 'dark' ? 'rgba(50, 58, 71, 1)' : 'rgba(255, 255, 255, 1)'"
                        :border-radius="50"
                        style="width: 30px; height: 30px; flex-shrink: 0;"
                        @click="editable = !editable"
                    >
                        <i
                            class="ms-Icon"
                            :class="[`ms-Icon--${editable ? 'Accept' : 'Edit'}`]"
                            style="font-size: 12px;"
                        ></i>
                    </fv-button>
                    <feedback-block
                        v-if="!visibleFeedback"
                        v-show="thisValue.role === 'assistant' && showFeedback && thisValue.finished !== 'loading'"
                        :value="thisValue"
                        :title="local('Feedback')"
                    ></feedback-block>
                    <visible-feedback-block
                        v-else
                        v-show="thisValue.role === 'assistant' && showFeedback && thisValue.finished !== 'loading'"
                        :value="thisValue"
                        :title="local('Feedback')"
                    ></visible-feedback-block>
                    <fv-button
                        v-if="showReader"
                        v-show="thisValue.role === 'assistant'"
                        :theme="theme"
                        :background="theme === 'dark' ? 'rgba(50, 58, 71, 1)' : 'rgba(255, 255, 255, 1)'"
                        :border-radius="50"
                        :disabled="holdon"
                        style="width: 30px; height: 30px; margin-left: 5px; flex-shrink: 0;"
                        :title="local('Read Content')"
                        @click="$emit('read-context', thisValue.content)"
                    >
                        <i
                            class="ms-Icon"
                            :class="[`ms-Icon--Speech`]"
                            style="font-size: 12px;"
                        ></i>
                    </fv-button>
                    <fv-button
                        :border-radius="50"
                        :theme="theme"
                        :background="theme === 'dark' ? 'rgba(50, 58, 71, 1)' : 'rgba(255, 255, 255, 1)'"
                        style="width: 30px; height: 30px; margin-left: 5px; flex-shrink: 0;"
                        :title="local('Copy')"
                        @click="copyText"
                    >
                        <i
                            class="ms-Icon"
                            :class="[`ms-Icon--${copyIcon}`]"
                            style="font-size: 12px;"
                        ></i>
                    </fv-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import markdownItSubscript from 'markdown-it-sub';
import markdownItSuperscript from 'markdown-it-sup';
import markdownItMark from 'markdown-it-mark';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

import gptImg from '@/assets/chat/gpt.svg';
import feedbackBlock from '@/components/chat/msgBlock/feedback/feedbackBlock.vue';
import visibleFeedbackBlock from '@/components/chat/msgBlock/feedback/visibleFeedbackBlock.vue';

export default {
    components: {
        feedbackBlock,
        visibleFeedbackBlock
    },
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        versionIdx: {
            default: 0
        },
        versionTotal: {
            default: 0
        },
        holdon: {
            default: false
        },
        nickname: {
            default: ''
        },
        modelAvatar: {
            default: null
        },
        showFeedback: {
            default: true
        },
        visibleFeedback: {
            default: false
        },
        showReader: {
            default: false
        }
    },
    data() {
        return {
            thisValue: this.value,
            mdHTML: '',
            md: new MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
                highlight: (code, lang) => {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return (
                                `<pre class="hljs"><code data-language="${lang}">` +
                                hljs.highlight(code, {
                                    language: lang,
                                    ignoreIllegals: true
                                }).value +
                                `</code></pre>`
                            );
                        } catch (error) {}
                    }
                    return ''; // 如果无法识别语言，则返回原始代码
                }
            })
                .use(markdownItKatex)
                .use(markdownItSubscript)
                .use(markdownItSuperscript)
                .use(markdownItMark),
            copyIcon: 'Copy',
            feedback: {
                rate: 0,
                hoverRate: 0,
                content: ''
            },
            img: {
                gpt: gptImg
            },
            editable: false,
            timer: {
                copyIcon: null
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
        },
        'thisValue.content'() {
            this.renderMarkdown();
        },
        'thisValue.finished'(val) {
            if (val && val !== 'loading') this.renderMarkdown();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        ...mapState({
            userInfo: (state) => state.User.info
        }),
        getRoleName() {
            if (this.thisValue.role === 'user') return this.local('You');
            if (this.nickname && this.thisValue.role !== 'user')
                return this.nickname;
            return (
                this.thisValue.role[0].toUpperCase() +
                this.thisValue.role.slice(1)
            );
        }
    },
    mounted() {
        this.renderMarkdown();
    },
    methods: {
        renderMarkdown() {
            let decode = this.thisValue.content.replace(/\n\n/g, '\n');
            let mdHTML = this.md.render(decode);
            this.mdHTML = mdHTML;
            if (this.thisValue.finished === 'loading') {
                this.$nextTick(() => {
                    let contentEl = this.$el.querySelector('.msg-content');
                    let last = contentEl.lastElementChild;
                    if (last && ['UL', 'OL', 'PRE'].includes(last.nodeName)) {
                        last = last.lastElementChild;
                    }
                    if (last) {
                        let rangeEl = `<i class="msg-content-generating-block" style="background: ${this.gradient};"></i>`;
                        last.insertAdjacentHTML('beforeend', rangeEl);
                    }
                });
            } else if (this.thisValue.finished === 'stop') {
                this.mdHTML = mdHTML + '<i></i>';
            }
        },
        setEditorContent() {
            let decode = this.thisValue.content.replace(/\n\n/g, '\n');
            return this.$refs.editor.insertMarkdown(decode);
        },
        getEditorContent() {
            let content = this.$refs.editor.saveMarkdown();
            this.$emit('revise-submit', {
                msg: this.thisValue,
                content
            });
            this.editable = false;
        },
        copyText() {
            let content = this.thisValue.content.replace(/\n\n/g, '\n');
            navigator.clipboard.writeText(content).then(() => {
                this.copyIcon = 'Accept';
                clearTimeout(this.timer.copyIcon);
                this.timer.copyIcon = setTimeout(() => {
                    this.copyIcon = 'Copy';
                }, 1000);
            });
        }
    }
};
</script>

<style lang="scss">
.msg-block {
    @include HcenterC;

    position: relative;
    width: 100%;
    height: auto;
    margin-bottom: 5px;
    display: flex;
    overflow-x: hidden;

    &:last-child {
        margin-bottom: 100px;
    }

    &.dark {
        .msg-role-block {
            .msg-guid {
                color: whitesmoke;
            }
        }

        .msg-wrapper {
            background: rgba(43, 50, 76, 0.6);
        }

        .msg-content-block {
            .msg-content {
                color: rgba(185, 188, 200, 1);

                a {
                    color: rgba(155, 155, 255, 1);
                }
            }
        }

        .msg-control-block {
            .version-display-block {
                color: whitesmoke;
            }
        }
    }

    .msg-wrapper {
        @include HcenterC;

        position: relative;
        width: 100%;
        max-width: 900px;
        height: auto;
        padding: 10px 0px;
        background: white;
        border-bottom: rgba(200, 200, 200, 0) solid thin;
        border-radius: 12px;
        display: flex;
        overflow-x: hidden;
    }

    .msg-role-block {
        @include Vcenter;

        position: relative;
        width: 100%;
        max-width: 900px;
        height: auto;
        flex-shrink: 0;
        padding: 5px 15px;
        border-radius: 8px;

        .msg-guid {
            @include nowrap;

            font-size: 13px;
            font-weight: bold;
            color: rgba(13, 13, 13, 1);
            user-select: none;
        }
    }

    .msg-control-block {
        @include Vstart;

        position: relative;
        width: 100%;
        max-width: 900px;
        height: auto;
        flex-shrink: 0;
        padding: 10px 15px;
        border-radius: 8px;

        .msg-control-left-block {
            @include Vcenter;

            width: 150px;
            height: 30px;
            flex-shrink: 0;

            .version-display-block {
                @include HcenterVcenter;

                margin: 0px 25px;
                font-size: 12px;
            }
        }

        .msg-control-right-block {
            @include Hend;

            width: auto;
            height: auto;
            flex: 1;
            overflow: hidden;
        }
    }

    .msg-content-block {
        position: relative;
        width: 100%;
        max-width: 900px;
        height: auto;
        flex-shrink: 0;
        padding: 15px;
        display: flex;

        .msg-role-block {
            @include HcenterVcenter;

            width: 35px;
            height: 35px;
            border-radius: 50%;
            user-select: none;
            overflow: hidden;

            .gpt-logo {
                width: 25px;
                height: 25px;
                filter: invert(1);
            }

            .model-avatar {
                width: 35px;
                height: 35px;
                object-fit: cover;
            }
        }

        .msg-content {
            @include VcenterC;

            position: relative;
            width: 10px;
            flex: 1;
            padding: 0px 15px;
            color: rgba(55, 65, 81, 1);
            line-height: 1.6;

            * {
                max-width: 100%;
                line-height: 1.5;
            }

            p {
                white-space: pre-wrap;
            }

            li {
                margin-left: 15px;
                margin-top: 10px;
            }

            pre {
                width: 100%;
                margin: 15px 0px;
                padding: 15px;
                background-color: rgba(36, 36, 36, 1);
                border-radius: 8px;
                box-sizing: border-box;
                line-height: 2;
                overflow-x: overlay;

                code {
                    color: inherit;
                    padding: 0;
                    background: none;
                    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono',
                        monospace;
                    color: whitesmoke;
                    line-height: 1.5;

                    &::before {
                        content: attr(data-language);

                        margin-bottom: 10px;
                        color: rgba(245, 245, 245, 0.6);
                        display: block;
                    }
                }
            }

            code {
                padding: 4px 6px;
                background-color: rgba(#616161, 0.1);
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono',
                    monospace;
                font-size: 13.8px;
                color: rgba(235, 87, 87, 1);
                border-radius: 3px;
            }

            table {
                border-collapse: collapse;
                table-layout: fixed;
                width: 100%;
                margin: 5px 0px;
                display: table;
                overflow: hidden;
                overflow-y: visible;

                td,
                th {
                    min-width: 1em;
                    border: thin solid #ced4da;
                    padding: 3px 5px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;

                    > * {
                        margin-bottom: 0;
                    }
                }

                th {
                    width: auto;
                    font-weight: bold;
                    text-align: left;
                    background-color: rgba(241, 243, 245, 1);
                }

                .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: '';
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }

                .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: rgba(145, 191, 209, 1);
                    pointer-events: none;
                }

                p {
                    margin: 0;
                }
            }

            .msg-content-generating-block {
                position: relative;
                top: 2px;
                width: 16px;
                height: 16px;
                margin-left: 10px;
                border-radius: 50%;
                user-select: none;
                animation: flash 0.1s infinite alternate;
                display: inline-block;
            }

            @keyframes flash {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }
        }

        .msg-editable-content-block {
            @include HcenterC;

            flex: 1;
            margin-left: 15px;

            .msg-power-editor {
                width: 100%;
                height: 300px;
                border: rgba(200, 200, 200, 0.1) solid thin;
                overflow: hidden;
            }

            .msg-editable-control-block {
                @include HcenterVcenter;

                width: 100%;
                margin-top: 15px;
            }
        }
    }
}

@media screen and (max-width: 1024px) {
    .msg-block {
        .msg-control-block {
            .msg-control-right-block {
            }
        }
    }
}
</style>