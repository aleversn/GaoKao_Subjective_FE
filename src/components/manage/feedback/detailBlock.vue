<template>
    <fv-panel
        v-if="thisValue"
        v-model="thisValue"
        :title="local('Chat Feedback')"
        width="550px"
        height="auto"
        background="rgba(255, 255, 255, 0.6)"
        title-size="13.8"
        :is-central-side="true"
        :is-acrylic="true"
        :is-footer="true"
    >
        <template v-slot:container>
            <div class="panel-container">
                <p class="panel-title">{{local('Query')}}</p>
                <power-editor
                    :placeholder="local('Write your feedback...')"
                    :editable="false"
                    class="feedback-power-editor"
                    ref="query"
                    :editorOutSideBackground="'transparent'"
                    editorBackground="transparent"
                    @on-mounted="setQueryContent"
                ></power-editor>
                <p class="panel-title">{{local('Answer')}}</p>
                <power-editor
                    :placeholder="local('Write your feedback...')"
                    :editable="false"
                    class="feedback-power-editor"
                    ref="answer"
                    :editorBackground="theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'"
                    :editorOutSideBackground="theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'"
                    style="margin-top: 5px;"
                    @on-mounted="setAnswerContent"
                ></power-editor>
                <p class="panel-title">{{local('Feedback')}}</p>
                <power-editor
                    :placeholder="local('Write your feedback...')"
                    :editable="false"
                    class="feedback-power-editor"
                    ref="comment"
                    :editorOutSideBackground="'transparent'"
                    editorBackground="transparent"
                    style="margin-top: 5px;"
                    @on-mounted="setCommentContent"
                ></power-editor>
            </div>
        </template>
        <template v-slot:footer>
            <fv-button
                style="width: 120px; margin-left: 5px"
                @click="thisValue = false"
            >{{local('Cancel')}}</fv-button>
        </template>
    </fv-panel>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        value: {
            default: false
        },
        feedback: {
            default: () => ({})
        }
    },
    data() {
        return {
            thisValue: this.value
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
        },
        thisValue(val) {
            this.$emit('input', val);
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.globalAppendInit();
    },
    methods: {
        globalAppendInit() {
            this.$nextTick(() => {
                const body = document.querySelector('body');
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
            });
        },
        setQueryContent() {
            let decode = this.feedback.parentContent.replace(/\n\n/g, '\n');
            return this.$refs.query.insertMarkdown(decode);
        },
        setAnswerContent() {
            let decode = this.feedback.content.replace(/\n\n/g, '\n');
            return this.$refs.answer.insertMarkdown(decode);
        },
        setCommentContent() {
            let decode = this.feedback.comment.replace(/\n\n/g, '\n');
            return this.$refs.comment.insertMarkdown(decode);
        }
    }
};
</script>

<style lang="scss">
.panel-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px 15px 55px 15px;
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    font-weight: 400;
    line-height: 2;

    .panel-title {
        margin-top: 5px;
        font-size: 16px;
        font-weight: bold;
    }

    .panel-row {
        position: relative;
        margin: 10px 0px;
        padding: 0px 5px;
        display: flex;
        align-items: center;

        .email-info {
            @include Vcenter;

            margin-top: 5px;
        }
    }

    .feedback-power-editor {
        width: 100%;
        min-height: 150px;
        height: auto;
        max-height: 300px;
        border: rgba(200, 200, 200, 0.1) solid thin;
        overflow: hidden;
    }
}

@media screen and (max-height: 836px) {
    .panel-container {
        .feedback-power-editor {
            height: 150px;
        }
    }
}
</style>