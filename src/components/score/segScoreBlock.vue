<template>
    <div
        class="sas-seg-score-block"
        :class="[{ dark: theme === 'dark', extend: show.extendFeedback }]"
    >
        <fv-button
            theme="dark"
            :background="!unsave ? color : 'rgba(246, 175, 75, 1)'"
            :border-radius="50"
            :disabled="!lock"
            :title="
                !unsave
                    ? !show.extendFeedback
                        ? '打步骤分'
                        : '折叠'
                    : '未保存的修改'
            "
            style="min-width: 30px; width: 30px; height: 30px"
            @mouseenter.native="extendFeedback(true)"
            @mouseleave.native="extendFeedback(false)"
            @touchend.native="extendFeedback(false)"
            @click="switchWindow"
        >
            <i
                v-show="!segValue.label"
                class="ms-Icon"
                :class="[
                    `ms-Icon--${
                        show.extendFeedback ? 'ChevronRightMed' : 'LockFeedback'
                    }`
                ]"
                style="font-size: 12px"
            ></i>
            <p v-show="segValue.label">{{ segValue.label }}</p>
        </fv-button>
        <div v-if="show.extendFeedback" class="msg-control-feedback-content">
            <p class="msg-control-feedback-title">
                请选择一下该步骤包含哪些错误类型?
            </p>
            <div v-show="lock" class="sas-score-error-type-list">
                <fv-button
                    v-for="(err, ei) in errorList"
                    :key="ei"
                    :theme="highlightSegError(err.name) ? 'dark' : 'light'"
                    :background="
                        highlightSegError(err.name)
                            ? 'rgba(163, 159, 233, 1)'
                            : ''
                    "
                    :border-radius="6"
                    :disabled="!value.scoreItem.label && value.showTotalScore"
                    :is-box-shadow="true"
                    style="width: 100%; height: 35px; margin: 3px"
                    @click="setSegError(err.name)"
                    >{{ err.name }}</fv-button
                >
            </div>
            <div v-if="value.scoreItem" class="seg-score-info">
                <fv-text-box
                    v-model="segValue.label"
                    underline
                    :placeholder="'步骤分'"
                    :border-width="2"
                    :border-color="'transparent'"
                    :focus-border-color="color"
                    :font-size="12"
                    :is-box-shadow="true"
                    :icon="'Tag'"
                    ref="label"
                    style="width: 120px; height: 35px"
                    @keydown="unsave = true"
                    @keydown.enter="confirmSeg"
                ></fv-text-box>
                <fv-button
                    :icon="'Refresh'"
                    :border-radius="6"
                    :is-box-shadow="true"
                    style="height: 35px; margin-left: 5px"
                    @click="clearSegLabel"
                    >清空</fv-button
                >
                <fv-button
                    theme="dark"
                    :icon="'StatusErrorFull'"
                    background="rgba(173, 38, 45, 1)"
                    :border-radius="6"
                    :is-box-shadow="true"
                    style="height: 35px; margin-left: 5px"
                    @click="segValue.label = '0'"
                    >零分</fv-button
                >
                <fv-button
                    v-show="lock"
                    theme="dark"
                    :background="
                        value.showTotalScore
                            ? 'rgba(0, 204, 158, 1)'
                            : 'rgba(163, 159, 233, 1)'
                    "
                    :disabled="!value.scoreItem.label && value.showTotalScore"
                    :border-radius="6"
                    :is-box-shadow="true"
                    style="width: 120px; height: 35px; margin-left: 5px"
                    @click="confirmSeg"
                    >确定提交</fv-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        value: {
            default: () => ({})
        },
        idx: {
            default: -1
        },
        errors: {
            default: () => ({})
        },
        lock: {
            default: true
        }
    },
    data() {
        return {
            segValue: {
                idx: this.idx,
                label: '',
                errors: []
            },
            unsave: false,
            show: {
                extendFeedback: false,
                feedbackContent: false
            },
            timer: {
                extendFeedback: null
            }
        };
    },
    watch: {
        idx() {
            this.segValue.idx = this.idx;
            this.refreshSegLabel();
        },
        value(val) {
            this.show.extendFeedback = false;
            this.refreshSegLabel();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        seg_labels() {
            if (this.value.scoreItem.seg_labels)
                return this.value.scoreItem.seg_labels;
            return [];
        },
        errorList() {
            if (this.errors.errors) return this.errors.errors;
            return [];
        }
    },
    mounted() {
        this.refreshSegLabel();
    },
    methods: {
        extendFeedback(status) {
            clearTimeout(this.timer.extendFeedback);
            if (status)
                this.timer.extendFeedback = setTimeout(() => {
                    this.show.extendFeedback = true;
                }, 1000);
        },
        highlightSegError(name) {
            return this.segValue.errors.indexOf(name) !== -1;
        },
        setSegError(name) {
            if (this.segValue.errors.indexOf(name) === -1)
                this.segValue.errors.push(name);
            else
                this.segValue.errors.splice(
                    this.segValue.errors.indexOf(name),
                    1
                );
            this.unsave = true;
        },
        refreshSegLabel() {
            let item = this.value.scoreItem.seg_labels.find(
                (it) => it.idx === this.idx
            );
            if (item) {
                this.segValue.label = item.label;
                this.segValue.errors = item.errors;
            } else this.clearSegLabel();
            this.unsave = false;
        },
        clearSegLabel() {
            this.segValue.label = '';
            this.segValue.errors = [];
            this.unsave = true;
            this.$nextTick(() => {
                if (this.$refs.label) this.$refs.label.focus();
            });
        },
        confirmSeg() {
            let item = this.value.scoreItem.seg_labels.find(
                (it) => it.idx === this.idx
            );
            if (item) {
                let index = this.value.scoreItem.seg_labels.indexOf(item);
                for (let key in this.segValue) {
                    item[key] = this.segValue[key];
                }
                this.$set(this.value.scoreItem.seg_labels, index, item);
            } else {
                this.value.scoreItem.seg_labels.push(
                    JSON.parse(JSON.stringify(this.segValue))
                );
            }
            this.unsave = false;
            this.$emit('confirm');
            this.show.extendFeedback = false;
        },
        switchWindow() {
            if (this.show.extendFeedback && this.unsave) {
                this.$infoBox('还未提交变更分数, 确定关闭?', {
                    status: 'warning',
                    title: '确定关闭?',
                    confirm: () => {
                        this.show.extendFeedback ^= true;
                    },
                    cancel: () => {}
                });
            } else this.show.extendFeedback ^= true;
        }
    }
};
</script>

<style lang="scss">
.sas-seg-score-block {
    @include Vcenter;

    position: relative;
    width: 30px;
    min-height: 0px;
    border-color: transparent;
    border-radius: 8px;
    transition: all 0.3s;

    &.extend {
        position: absolute;
        right: 5px;
        top: 5px;
        min-width: 350px;
        width: 410px;
        max-width: calc(100% - 10px);
        padding: 0px 5px;
        background: rgba(245, 245, 245, 1);
        border: rgba(200, 200, 200, 0.3) solid thin;
        z-index: 1;
        animation: extend-show 0.5s ease-out;
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
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

            .sas-score-error-type-list {
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

        .sas-score-error-type-list {
            @include VcenterC;

            .rating-title {
                margin-left: 5px;
                font-size: 12px;
                font-weight: bold;
            }
        }

        .seg-score-info {
            @include Vcenter;

            margin-top: 15px;
        }
    }

    @keyframes extend-show {
        0% {
            min-width: 30px;
            width: 30px;
            min-height: 50px;
            height: 250px;
        }
        70% {
            min-width: 250px;
            min-height: 150px;
            height: 350px;
        }
        100% {
            min-width: 250px;
            min-height: 100px;
            height: auto;
        }
    }
}
</style>
