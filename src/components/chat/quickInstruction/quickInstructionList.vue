<template>
    <div
        class="las-quick-instruction-list-container"
        :class="[{dark: theme === 'dark'}]"
    >
        <div
            class="title-block"
            :style="{color: color}"
        >
            <div class="left-block">
                <i class="ms-Icon ms-Icon--LightningBolt"></i>
                <p style="margin-left: 5px;">{{local('Quick Instructions Combo')}}</p>
            </div>
            <fv-button
                v-show="!relative"
                theme="dark"
                :border-radius="50"
                :background="color"
                style="width: 35px; height: 30px;"
                @click="$emit('close')"
            >
                <i class="ms-Icon ms-Icon--Cancel"></i>
            </fv-button>
        </div>
        <div class="content-block">
            <quick-instruction-group
                v-for="(group, index) in groups"
                :key="index"
                :group="group"
            >
                <div
                    v-for="(item, j) in group.questions"
                    :key="j"
                    class="las-quick-instruction-item"
                    :style="{background: gradient01}"
                    @click="quickCMD(item.question)"
                >
                    <div class="item-title-block">
                        <div class="left-block">
                            <i class="ms-Icon ms-Icon--LightningBolt"></i>
                            <p style="margin-left: 5px;">{{local('Quick Instruction')}}</p>
                        </div>
                        <div class="right-block">
                            <fv-button
                                :theme="theme"
                                :border-radius="6"
                                :font-size="12"
                                :background="theme === 'dark' ? 'rgba(50, 58, 71, 0.1)' : 'rgba(245, 245, 245, 1)'"
                                :title="local('Send after editing')"
                                style="width: 25px; height: 25px;"
                                @click="quickEditCMD($event, item.question)"
                            >
                                <i
                                    class="ms-Icon"
                                    :class="[`ms-Icon--ReplyMirrored`]"
                                    style="font-size: 12px;"
                                ></i>
                            </fv-button>
                        </div>
                    </div>
                    <p class="main-content">{{item.question}}</p>
                </div>
            </quick-instruction-group>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import quickInstructionGroup from './quickInstructionGroup.vue';

export default {
    components: {
        quickInstructionGroup
    },
    props: {
        value: {
            default: () => []
        },
        relative: {
            default: false
        }
    },
    data() {
        return {
            groups: []
        };
    },
    watch: {
        value: {
            handler() {
                this.getValue();
            },
            immediate: true
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'gradient01', 'theme'])
    },
    methods: {
        getValue() {
            let groups = [];
            this.value.forEach((item) => {
                if (!item.tag) item.tag = this.local('Other Group');
                let exists = groups.find((group) => group.tag === item.tag);
                if (!exists) {
                    groups.push({
                        tag: item.tag,
                        questions: [item]
                    });
                } else {
                    exists.questions.push(item);
                }
            });
            groups.sort((a, b) => {
                if (a.tag === this.local('Other Group')) return 1;
            });
            if (groups.length > 0) groups[0].show = true;
            this.groups = groups;
        },
        quickCMD(context) {
            this.$emit('quick-context', context);
        },
        quickEditCMD(event, context) {
            event.stopPropagation();
            this.$emit('quick-edit', context);
        }
    }
};
</script>

<style lang="scss">
.las-quick-instruction-list-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.dark {
        .content-block {
            .las-quick-instruction-item {
                &:hover {
                    background: rgba(250, 250, 250, 1);
                    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
                }

                &:active {
                    background: rgba(245, 245, 245, 0.8);
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
                }

                .main-content {
                    color: rgba(200, 200, 200, 1);
                }
            }
        }
    }

    .title-block {
        @include Vcenter;

        position: relative;
        width: 100%;
        padding: 10px;
        font-size: 12px;
        font-weight: bold;

        .left-block {
            @include Vcenter;

            position: relative;
            width: 10px;
            height: 30px;
            flex: 1;
            font-size: 13.8px;
        }
    }

    .content-block {
        position: relative;
        width: 100%;
        height: 10px;
        flex: 1;
        padding: 0px 10px;
        padding-bottom: 15px;
        display: flex;
        flex-direction: column;
        overflow: overlay;

        .las-quick-instruction-item {
            position: relative;
            width: 200px;
            height: 120px;
            padding: 10px;
            background: rgba(245, 245, 245, 1);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s;
            user-select: none;
            overflow: hidden;

            &:hover {
                background: rgba(250, 250, 250, 1);
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
            }

            &:active {
                background: rgba(245, 245, 245, 0.8);
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
            }

            .item-title-block {
                @include Vcenter;

                position: relative;
                width: 100%;
                height: 30px;
                font-size: 12px;
                font-weight: bold;

                .left-block {
                    @include Vcenter;

                    position: relative;
                    flex: 1;
                }

                .item-control-block {
                    @include HendVcenter;

                    position: relative;
                    flex: 1;
                }
            }

            .main-content {
                position: relative;
                width: 100%;
                height: 10px;
                flex: 1;
                font-size: 13.8px;
                color: rgba(50, 49, 48, 1);
                overflow: hidden;
            }
        }
    }
}
</style>