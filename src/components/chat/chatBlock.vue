<template>
    <div
        v-if="value"
        class="chat-block-container"
    >
        <msg-block
            v-if="value.messageId !== 'root'"
            :value="value"
            :versionIdx="versionIdx"
            :versionTotal="versionTotal"
            :holdon="holdon"
            :showFeedback="showFeedback"
            :showReader="showReader"
            :nickname="nickname"
            :modelAvatar="modelAvatar"
            :visibleFeedback="visibleFeedback"
            @switch-version="$emit('switch-version', $event)"
            @revise-submit="$emit('revise-submit', $event)"
            @read-context="$emit('read-context', $event)"
        ></msg-block>
        <chat-block
            :value="currentChoosen"
            :versionIdx="value.childIdx"
            :versionTotal="value.children.length"
            :holdon="holdon"
            :showReader="showReader"
            :nickname="nickname"
            :modelAvatar="modelAvatar"
            :visibleFeedback="visibleFeedback"
            @switch-version="changeVersion"
            @revise-submit="$emit('revise-submit', $event)"
            @read-context="$emit('read-context', $event)"
        ></chat-block>
    </div>
</template>

<script>
import msgBlock from '@/components/chat/msgBlock';

export default {
    name: 'chatBlock',
    components: {
        msgBlock
    },
    props: {
        value: {
            default: () => ({})
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
        visibleFeedback: {
            default: false
        },
        showFeedback: {
            default: true
        },
        showReader: {
            default: false
        }
    },
    data() {
        return {};
    },
    watch: {},
    computed: {
        currentChoosen() {
            if (this.value.children.length === 0) return null;
            return this.children[this.value.childIdx];
        },
        children() {
            return this.value.children;
        }
    },
    mounted() {},
    methods: {
        changeVersion(status = 'prev') {
            if (status === 'prev') {
                if (this.value.childIdx === 0) return;
                this.value.childIdx--;
            } else {
                if (this.value.childIdx === this.value.children.length - 1)
                    return;
                this.value.childIdx++;
            }
        }
    }
};
</script>

<style lang="scss">
.chat-block-container {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    &:first-child {
        padding-top: 20px;
    }
}
</style>