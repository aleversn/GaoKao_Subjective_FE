<template>
    <div
        class="msg-control-visible-feedback-block"
        :class="[{dark: theme === 'dark'}]"
    >
        <fv-button
            :theme="feedback.rate === 1 ? 'dark' : theme"
            :background="feedback.rate === 1 ? color : 'transparent'"
            :border-color="theme === 'dark' ? 'rgba(200, 200, 200, 0.1)' : ''"
            :disabled="!lock.rate"
            :border-radius="50"
            icon="Dislike"
            font-size="12"
            style="width: 90px; height: 30px; flex-shrink: 0; margin-left: 5px;"
            :title="local('Not helpful')"
            @click="feedback.rate = 1"
        >{{local("Not helpful")}}</fv-button>
        <fv-button
            :theme="feedback.rate === 4 ? 'dark' : theme"
            :background="feedback.rate === 4 ? color : 'transparent'"
            :border-color="theme === 'dark' ? 'rgba(200, 200, 200, 0.1)' : ''"
            :disabled="!lock.rate"
            :border-radius="50"
            icon="Like"
            font-size="12"
            style="width: 90px; height: 30px; flex-shrink: 0; margin-left: 5px;"
            :title="local('It\'s helpful')"
            @click="feedback.rate = 4"
        >
            {{local("It's helpful")}}
        </fv-button>
        <fv-button
            :theme="feedback.content ? 'dark' : theme"
            :background="feedback.content ? color : 'transparent'"
            :border-color="theme === 'dark' ? 'rgba(200, 200, 200, 0.1)' : ''"
            :disabled="!lock.rate"
            :border-radius="50"
            :icon="'Feedback'"
            style="width: 90px;"
            @click="show.feedbackContent = true"
        >{{!feedback.content ? local('Ridicule') : local('Revise')}}</fv-button>
        <feedback-description
            v-model="show.feedbackContent"
            :chat="thisValue"
            :content="feedback.content"
            @update-comment="feedback.content = $event"
        ></feedback-description>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import feedbackDescription from '@/components/chat/msgBlock/feedback/feedbackDescription.vue';

export default {
    components: {
        feedbackDescription
    },
    props: {
        value: {
            default: () => ({})
        }
    },
    data() {
        return {
            thisValue: this.value,
            feedback: {
                rate: 0,
                hoverRate: 0,
                maxRate: 4,
                content: ''
            },
            show: {
                feedbackContent: false
            },
            lock: {
                rate: true
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
            this.getCommentAndScore();
        },
        'feedback.rate'(val, oldVal) {
            this.updateMessageScore(val, oldVal);
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.getCommentAndScore();
    },
    methods: {
        getCommentAndScore() {
            if (!this.lock.rate) return;
            this.lock.rate = false;
            this.$api.ModelController.getMessageScoreComment(
                this.thisValue.chatId,
                this.thisValue.messageId
            )
                .then((res) => {
                    if (res.code === 200) {
                        if (res.data) {
                            if (res.data.score) {
                                this.feedback.rate = res.data.score;
                            } else this.feedback.rate = 0;
                            if (res.data.comment) {
                                this.feedback.content = res.data.comment;
                            } else this.feedback.content = '';
                        } else {
                            this.feedback.rate = 0;
                            this.feedback.content = '';
                        }
                        this.lock.rate = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.lock.rate = true;
                });
        },
        updateMessageScore(val, oldVal) {
            if (!this.lock.rate) return;
            if (val === oldVal) return;
            this.lock.rate = false;
            this.$api.ModelController.submitMessageScore(
                this.thisValue.chatId,
                this.thisValue.messageId,
                {
                    score: val
                }
            )
                .then((res) => {
                    if (res.code !== 200) {
                        this.feedback.rate = oldVal;
                    }
                    this.lock.rate = true;
                })
                .catch((err) => {
                    console.log(err);
                    this.feedback.rate = oldVal;
                    this.lock.rate = true;
                });
        }
    }
};
</script>

<style lang="scss">
.msg-control-visible-feedback-block {
    @include Vcenter;

    position: relative;
    width: auto;
    min-height: 0px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 8px;
    flex-direction: row-reverse;
    transition: all 0.3s;
    overflow: overlay;

    .msg-control-feedback-content {
        position: relative;
        flex: 1;
        width: 10px;
        height: auto;
        padding: 10px;
        line-height: 2;
        display: flex;
        flex-direction: column;

        .msg-control-feedback-title {
            margin-left: 5px;
            font-size: 15px;
            color: rgba(120, 120, 120, 1);
        }

        .msg-control-feedback-rating-block {
            @include Vcenter;

            .rating-title {
                margin-left: 5px;
                font-size: 12px;
                font-weight: bold;
            }
        }
    }

    @keyframes extend-show {
        0% {
            min-width: 30px;
            width: 30px;
            min-height: 30px;
            height: 30px;
        }
        70% {
            min-width: 250px;
            min-height: 30px;
            height: 30px;
        }
        100% {
            min-width: 250px;
            min-height: 100px;
            height: auto;
        }
    }
}
</style>