import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import loadingTyping from './loadingTyping.vue';

export default Node.create({
    name: 'loadingTyping',

    group: 'inline',

    inline: true,

    addAttributes() {
        return {
            value: {
                default: true,
            },
            background: {
                default: {}
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'loading-typing',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['loading-typing', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(loadingTyping);
    },

});
