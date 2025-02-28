<template>
    <div
        class="las-quick-instruction-wrapper"
        :class="[{dark: theme === 'dark', relative: alwaysShow}]"
    >
        <fv-drawer
            v-if="!alwaysShow"
            v-model="thisValue"
            class="las-quick-instruction-container"
            :class="[{dark: theme === 'dark'}]"
            position="right"
            appendBody
            :length="480"
        >
            <quick-instruction-list
                :value="quickQuestions"
                @quick-context="$emit('quick-context', $event)"
                @quick-edit="$emit('quick-edit', $event)"
                @close="thisValue = false"
            ></quick-instruction-list>
        </fv-drawer>
        <quick-instruction-list
            v-show="alwaysShow"
            :value="quickQuestions"
            :relative="alwaysShow"
            @quick-context="$emit('quick-context', $event)"
            @quick-edit="$emit('quick-edit', $event)"
            @close="thisValue = false"
        ></quick-instruction-list>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import quickInstructionList from './quickInstructionList.vue';

export default {
    components: {
        quickInstructionList
    },
    props: {
        value: {
            default: false
        },
        alwaysShow: {
            default: false
        },
        quickQuestions: {
            default: () => []
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
    }
};
</script>

<style lang="scss">
.las-quick-instruction-wrapper {
    position: absolute;
    isolation: isolate;
    background: rgba(250, 250, 250, 0.8);

    &.dark {
        &.relative {
            background: rgba(36, 36, 36, 0.6);
        }
    }

    &.relative {
        position: relative;
        width: 480px;
        height: 100%;
        display: flex;
    }
}

.las-quick-instruction-container {
    background: rgba(250, 250, 250, 0.8);

    &.dark {
        background: rgba(36, 36, 36, 0.8);
    }
}
</style>