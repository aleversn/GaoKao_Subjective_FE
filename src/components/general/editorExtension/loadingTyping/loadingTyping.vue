<template>
    <node-view-wrapper
        v-if="node"
        v-show="node.attrs.value"
        as="span"
        class="power-editor-loading-typing"
        :class="{ dark: thisTheme === 'dark' }"
    >
        <i
            contenteditable="false"
            class="msg-content-generating-block"
            :style="{background: node.attrs.background}"
        ></i>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-2';

export default {
    components: {
        NodeViewWrapper
    },
    props: {
        // the editor instance
        editor: {
            type: Object
        },

        // the current node
        node: {
            type: Object
        },

        // an array of decorations
        decorations: {
            type: Array
        },

        // `true` when there is a `NodeSelection` at the current node view
        selected: {
            type: Boolean
        },

        // access to the node extension, for example to get options
        extension: {
            type: Object
        },

        // get the document position of the current node
        getPos: {
            type: Function
        },

        // update attributes of the current node
        updateAttributes: {
            type: Function
        },

        // delete the current node
        deleteNode: {
            type: Function
        }
    },
    data() {
        return {
            thisTheme: this.editor.storage.defaultStorage.theme
        };
    },
    watch: {
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        }
    },
    computed: {},
    mounted() {},

    methods: {}
};
</script>

<style lang="scss">
.power-editor-loading-typing {
    .msg-content-generating-block {
        position: relative;
        top: 2.5px;
        width: 16px;
        height: 16px;
        margin-left: 5px;
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
</style>
