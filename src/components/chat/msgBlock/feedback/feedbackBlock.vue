<template>
    <div
        class="msg-control-feedback-block"
        :class="[{dark: theme === 'dark', extend: show.extendFeedback}]"
    >
        <fv-button
            theme="dark"
            :background="color"
            :border-radius="50"
            style="min-width: 30px; width: 30px; height: 30px;"
            @mouseenter.native="extendFeedback(true)"
            @mouseleave.native="extendFeedback(false)"
            @touchend.native="extendFeedback(false)"
            @click="show.extendFeedback ^= true"
        >
            <i
                class="ms-Icon"
                :class="[`ms-Icon--${show.extendFeedback ? 'ChevronRightMed' : 'Feedback'}`]"
                style="font-size: 12px;"
            ></i>
        </fv-button>
        <transition :name="show.extendFeedback ? 'move-bottom-to-top' : ''">
            <div
                v-show="show.extendFeedback"
                class="msg-control-feedback-content"
            >
                <p class="msg-control-feedback-title">{{local('Are you satisfied this answer ?')}}</p>
                <div class="msg-control-feedback-rating-block">
                    <fv-rating-control
                        v-model="feedback.rate"
                        :theme="theme"
                        :max-rate="feedback.maxRate"
                        :selected-color="color"
                        :is-clear="true"
                        :readonly="!lock.rate"
                        @hover="feedback.hoverRate = $event.index"
                        @leave="feedback.hoverRate = feedback.rate - 1"
                    ></fv-rating-control>
                    <p class="rating-title">{{rateDescription}}</p>
                </div>
                <p class="msg-control-feedback-title">{{local('Besides, you can write some feedback.')}}</p>
                <fv-button
                    theme="dark"
                    :icon="'Feedback'"
                    :background="color"
                    :disabled="!lock.rate"
                    style="width: 180px; margin-left: 5px;"
                    @click="show.feedbackContent = true"
                >{{!feedback.content ? local('Add New Feedback') : local('Revise Your Feedback')}}</fv-button>
            </div>
        </transition>
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
                extendFeedback: false,
                feedbackContent: false
            },
            timer: {
                extendFeedback: null
            },
            lock: {
                rate: true
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
            this.show.extendFeedback = false;
        },
        'feedback.rate'(val, oldVal) {
            this.updateMessageScore(val, oldVal);
        },
        'show.extendFeedback'(val) {
            if (val) this.getCommentAndScore();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        rateDescription() {
            if (this.feedback.hoverRate < 0) {
                return this.local('Unstarched');
            } else if (this.feedback.hoverRate < 1) {
                return this.local('Dissatisfied');
            }
            if (this.feedback.hoverRate < 2) {
                return this.local('Possible Error');
            } else if (this.feedback.hoverRate < 3) {
                return this.local('Probably right');
            } else return this.local('Satisfied');
        }
    },
    mounted() {},
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
        },
        extendFeedback(status) {
            clearTimeout(this.timer.extendFeedback);
            if (status)
                this.timer.extendFeedback = setTimeout(() => {
                    this.show.extendFeedback = true;
                }, 1000);
        }
    }
};
</script>

<style lang="scss">
.msg-control-feedback-block {
    @include Vcenter;

    position: relative;
    width: 30px;
    min-height: 0px;
    border-radius: 8px;
    transition: all 0.3s;

    &.extend {
        position: absolute;
        right: 5px;
        bottom: 0px;
        min-width: 250px;
        width: 410px;
        max-width: calc(100% - 10px);
        padding: 0px 5px;
        background: rgba(245, 245, 245, 1);
        z-index: 1;
        animation: extend-show 0.5s ease-out;
        overflow: hidden;
    }

    &.dark {
        &.extend {
            background: rgba(0, 0, 16, 1);
        }

        .msg-control-feedback-content {
            .msg-control-feedback-title {
                color: rgba(200, 200, 200, 1);
            }

            .msg-control-feedback-rating-block {
                .rating-title {
                    color: rgba(120, 120, 120, 1);
                }
            }
        }
    }

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