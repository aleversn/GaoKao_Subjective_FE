<template>
    <div class="m-msg-item-container">
        <div class="m-msg-item-row">
            <div class="m-msg-item-left">
                <i
                    class="ms-Icon"
                    :class="[`ms-Icon--${value.role === 'user' ? 'People' : 'Robot'}`]"
                ></i>
                <p style="margin-left: 5px;">{{value.role}}</p>
            </div>
            <div class="m-msg-item-right">
                <fv-button
                    v-show="value.role === 'user'"
                    :border-radius="50"
                    :disabled="loading || !lock"
                    :font-size="12"
                    style="width: 25px; height: 25px; margin-left: 10px;"
                    @click="editable = !editable"
                >
                    <i
                        class="ms-Icon"
                        :class="[`ms-Icon--${editable ? 'Accept' : 'Edit'}`]"
                        style="font-size: 12px;"
                    ></i>
                </fv-button>
                <fv-button
                    v-show="value.role === 'assistant'"
                    :border-radius="50"
                    :disabled="loading || !lock"
                    :font-size="12"
                    style="width: 25px; height: 25px; margin-left: 10px;"
                    @click="$emit('regenerate', $refs.editor.saveMarkdown())"
                >
                    <i
                        class="ms-Icon"
                        :class="[`ms-Icon--Refresh`]"
                        style="font-size: 12px;"
                    ></i>
                </fv-button>
                <fv-button
                    :border-radius="50"
                    :font-size="12"
                    style="width: 25px; height: 25px; margin-left: 10px;"
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
        <power-editor
            :placeholder="local('Revise your content')"
            class="las-playground-msg-item-editor-block"
            :editable="editable"
            ref="editor"
            :editorOutSideBackground="editable ? 'white' : 'transparent'"
            editorBackground="transparent"
            :readOnlyPaddingTop="0"
            :readOnlyPaddingBottom="15"
            :extensions="extensions"
            :showControlOnReadonly="false"
        ></power-editor>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import loadingTyping from '@/components/general/editorExtension/loadingTyping/loadingTyping.js';

export default {
    props: {
        value: {
            default: false
        },
        loading: {
            default: false
        },
        lock: {
            default: true
        }
    },
    data() {
        return {
            thisValue: this.value,
            extensions: [loadingTyping],
            editable: false,
            copyIcon: 'Copy',
            timer: {
                copyIcon: null
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
        },
        thisValue(val) {
            this.$emit('input', val);
            this.getContent();
        },
        'value.content'() {
            this.getContent();
        },
        loading() {
            this.getContent();
        },
        editable(val) {
            if (!val)
                this.$emit('regenerate', this.$refs.editor.saveMarkdown());
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.getContent();
    },
    methods: {
        getContent() {
            if (!this.value || !this.value.content) this.content = '';
            let decode = this.value.content.replace(/\n\n/g, '\n');
            this.$refs.editor.insertMarkdown(decode);
            if (this.loading)
                this.$refs.editor.editor.commands.insertContent({
                    name: 'loadingTyping',
                    type: 'loadingTyping',
                    attrs: {
                        background: this.gradient
                    }
                });
        },
        copyText() {
            let content = this.value.content.replace(/\n\n/g, '\n');
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
.m-msg-item-container {
    @include VcenterC;

    position: relative;
    width: 100%;
    max-width: 900px;
    height: auto;
    margin: 5px 0px;
    padding-top: 15px;
    flex-shrink: 0;
    background: linear-gradient(rgb(255, 255, 255), rgb(243, 244, 246));
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    border: rgba(229, 231, 235, 1) solid thin;
    border-radius: 12px;
    overflow: hidden;

    .m-msg-item-row {
        @include Vcenter;

        position: relative;
        width: 100%;
        height: auto;
        padding: 0px 20px;
        font-size: 15px;
        font-weight: bold;
    }

    .m-msg-item-left {
        @include Vcenter;

        flex: 1;
    }

    .m-msg-item-right {
        @include HendVcenter;
    }

    .las-playground-msg-item-editor-block {
        position: relative;
        width: 100%;
        max-width: 900px;
        height: auto;
        flex: 1;
        border: none;
        background: transparent;
        font-size: 15px;
        line-height: 1.5;
    }
}
</style>