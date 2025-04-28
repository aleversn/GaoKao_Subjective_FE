<template>
    <power-editor
        :placeholder="'Edit your question...'"
        :editable="editable"
        :theme="theme"
        class="msg-power-editor"
        ref="editor"
        :editorBackground="
            theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'transparent'
        "
        :editorOutSideBackground="
            theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : editorBackground
        "
        contentMaxWidth="3000px"
        readOnlyPaddingBottom="15"
        :style="{
            'box-shadow': editable ? '0px 0px 2px rgba(0, 0, 0, 0.1)' : ''
        }"
        @on-mounted="setEditorContent"
    ></power-editor>
</template>

<script>
export default {
    props: {
        value: {
            default: () => ({})
        },
        decode_key: {
            default: 'question'
        },
        editorBackground: {
            default: 'white'
        },
        mode: {
            default: false
        },
        editable: {
            default: false
        },
        theme: {
            default: 'light'
        }
    },
    data() {
        return {};
    },
    watch: {
        value() {
            this.setEditorContent();
        },
        decode_key() {
            this.setEditorContent();
        },
        editable(val) {
            if (!val) {
                let md = this.$refs.editor.saveMarkdown();
                this.$emit('update-value', {
                    item: this.value,
                    value: md
                });
            }
        }
    },
    methods: {
        setEditorContent() {
            let content = '';
            if (!this.mode)
                content = this.value[this.decode_key].replace(/\\n/g, '\n');
            else content = this.decode_key.replace(/\\n/g, '\n');
            let decode = content.replace(/\n\n/g, '\n');
            this.$refs.editor.insertMarkdown('');
            this.$refs.editor.insertMarkdown(decode);
        }
    }
};
</script>

<style></style>
