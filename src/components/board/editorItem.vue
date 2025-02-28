<template>
    <power-editor
        :placeholder="'Edit your question...'"
        :editable="false"
        :theme="theme"
        class="msg-power-editor"
        ref="editor"
        :editorBackground="theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'"
        :editorOutSideBackground="
            theme === 'dark' ? 'rgba(52, 64, 84, 0.3)' : 'white'
        "
        contentMaxWidth="3000px"
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
        }
    },
    methods: {
        setEditorContent() {
            let content = this.value[this.decode_key].replace(/\\n/g, '\n');
            let decode = content.replace(/\n\n/g, '\n');
            this.$refs.editor.insertMarkdown("");
            this.$refs.editor.insertMarkdown(decode);
        }
    }
};
</script>

<style></style>
