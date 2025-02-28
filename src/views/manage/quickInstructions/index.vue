<template>
    <div class="m-laws-block">
        <div class="row between">
            <h1 class="main-title">{{local('Model Quick Instructions Management')}}</h1>
            <fv-text-box
                v-model="currentSearch"
                :placeholder="local('Filter in the Result')"
                icon="Filter"
                borderWidth="2"
                :revealBorder="true"
                :is-box-shadow="true"
            ></fv-text-box>
        </div>
        <div class="row command-bar">
            <fv-combobox
                v-model="currentModel"
                :options="modelList"
                :placeholder="local('Select Model')"
                :itemHeight="60"
                :disabled="!lock.quickInstruction"
            >
                <template v-slot:default="x">
                    <i
                        class="before-choosen"
                        :style="{background: gradient}"
                    ></i>
                    <div class="combobox-custom-content">
                        <p class="c-main-title">{{x.item.text}}</p>
                        <span class="info-block">
                            <p class="max-len">{{local('Max Len')}}: {{(x.item.maxLength / 1000).toFixed(0)}}k</p>
                            <span class="price-block">
                                <i
                                    class="ms-Icon ms-Icon--StatusCircleInner"
                                    :style="{color: computePrice(x.item) === false ? 'rgba(241, 154, 30, 1)' : ''}"
                                ></i>
                                <p>{{computePrice(x.item) !== false ? `￥ ${computePrice(x.item)}/k` : local('Not Available')}}</p>
                            </span>
                        </span>
                    </div>
                </template>
            </fv-combobox>
            <fv-command-bar
                :options="cmd"
                background="transparent"
                style="flex: 1"
            ></fv-command-bar>
        </div>
        <div class="row main-table">
            <fv-details-list
                v-model="objs"
                :head="head"
                :filter="currentSearch"
                :foreground="color"
                style="width: 100%; height: 100%"
                :multiSelection="true"
                @rightclick="currentItem = $event"
                @choose-items="currentChoosen = $event"
            >
                <template v-slot:column_0="x">
                    <p class="sec">{{ x.row_index + 1 }}</p>
                </template>
                <template v-slot:column_1="x">
                    <p
                        class="sec highlight"
                        :title="x.item.id"
                        @click="showModelInfo(x.item)"
                    >{{ x.item.id }}</p>
                </template>
                <template v-slot:column_2="x">
                    <p
                        class="sec highlight"
                        :title="x.item.modelId"
                        @click="showModelInfo(x.item)"
                    >{{ x.item.modelId }}</p>
                </template>
                <template v-slot:column_3="x">
                    <p
                        v-show="!x.item.editable"
                        class="sec"
                        @dblclick="$set(x.item, 'editable', true)"
                    >{{ x.item.question }}</p>
                    <div
                        v-show="x.item.editable"
                        class="revise-block"
                    >
                        <fv-text-box
                            v-model="x.item.question"
                            underline
                            :border-width="2"
                            :border-color="'transparent'"
                            :focus-border-color="color"
                            :is-box-shadow="true"
                            @keyup.enter="reviseItem(x.item)"
                        ></fv-text-box>
                        <fv-button
                            theme="dark"
                            :background="color"
                            :border-radius="50"
                            fontSize="12"
                            :is-box-shadow="true"
                            :title="local('Confirm')"
                            style="position: absolute; right: 10px; width: 20px; height: 20px;"
                            @click="reviseItem(x.item)"
                        >
                            <i
                                class="ms-Icon ms-Icon--StatusCircleCheckmark"
                                style="font-size: 12px; color: whitesmoke;"
                            ></i>
                        </fv-button>
                    </div>
                </template>
                <template v-slot:column_4="x">
                    <fv-tag
                        v-show="!x.item.editable"
                        :value="x.item.tag ? [{text: x.item.tag, background: color}]: []"
                        @dblclick.native="$set(x.item, 'editable', true)"
                    ></fv-tag>
                    <div
                        v-show="x.item.editable"
                        class="revise-block"
                    >
                        <fv-text-box
                            v-model="x.item.tag"
                            underline
                            :border-width="2"
                            :border-color="'transparent'"
                            :focus-border-color="color"
                            :is-box-shadow="true"
                            @keyup.enter="reviseItem(x.item)"
                        ></fv-text-box>
                        <fv-button
                            theme="dark"
                            :background="color"
                            :border-radius="50"
                            fontSize="12"
                            :is-box-shadow="true"
                            :title="local('Confirm')"
                            style="position: absolute; right: 10px; width: 20px; height: 20px;"
                            @click="reviseItem(x.item)"
                        >
                            <i
                                class="ms-Icon ms-Icon--StatusCircleCheckmark"
                                style="font-size: 12px; color: whitesmoke;"
                            ></i>
                        </fv-button>
                    </div>
                </template>
                <template v-slot:column_5="x">
                    <p class="sec">{{ getDate(x.item.updatedAt) }}</p>
                </template>
                <template v-slot:column_6="x">
                    <p class="sec">{{ getDate(x.item.createdAt) }}</p>
                </template>
                <template v-slot:menu>
                    <div>
                        <span @click="show.modelInfo = true"><i
                                class="ms-Icon ms-Icon--GuestUser"
                                :style="{color: color}"
                            ></i>
                            <p>{{local('Model Info')}}</p>
                        </span>
                        <span @click="deleteQuickInstruction"><i
                                class="ms-Icon ms-Icon--Delete"
                                :style="{color: 'rgba(200, 38, 45, 1)'}"
                            ></i>
                            <p>{{local('Delete Quick Instruction')}}</p>
                        </span>
                    </div>
                </template>
            </fv-details-list>
        </div>
        <upload-quick-instructions
            v-model="show.upload"
            :model="currentModel"
            @finished="getModelQuickInstructions"
        ></upload-quick-instructions>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import uploadQuickInstructions from '@/components/manage/quickInstructions/uploadQuickInstructions.vue';

export default {
    components: {
        uploadQuickInstructions
    },
    data() {
        return {
            cmd: [
                {
                    name: () =>
                        this.local('Model number') +
                        ' ' +
                        this.modelList.length,
                    icon: 'DialShape3',
                    iconColor: () => this.color,
                    func: () => {}
                },
                {
                    name: () =>
                        this.local('Instruction number') +
                        ' ' +
                        this.objs.length,
                    icon: 'LightningBolt',
                    iconColor: () => this.color,
                    func: () => {}
                },
                {
                    name: () => this.local('Import Quick Instructions'),
                    icon: 'Upload',
                    iconColor: () => this.color,
                    func: () => (this.show.upload = true)
                },
                {
                    name: () => this.local('Delete Instructions'),
                    icon: 'Delete',
                    iconColor: () => 'rgba(200, 38, 45, 1)',
                    disabled: () =>
                        this.currentChoosen.length === 0 ||
                        !this.lock.deleteQuickInstructions,
                    func: this.deleteQuickInstructions
                }
            ],
            head: [
                { content: () => this.local('No.'), width: 120 },
                { content: 'id', sortName: 'id', width: 80 },
                {
                    content: () => this.local('Model ID'),
                    sortName: 'modelId',
                    width: 100
                },
                {
                    content: () => this.local('Instrcution'),
                    sortName: 'question',
                    width: 320
                },
                {
                    content: () => this.local('Tag'),
                    sortName: 'tag',
                    width: 200
                },
                {
                    content: () => this.local('Updated'),
                    sortName: 'updatedAt',
                    width: 200
                },
                {
                    content: () => this.local('Created'),
                    sortName: 'createdAt',
                    width: 100
                }
            ],
            objs: [],
            modelList: [],
            currentModel: {},
            currentSearch: '',
            currentItem: {},
            currentChoosen: [],
            show: {
                upload: false
            },
            lock: {
                quickInstruction: true,
                deleteQuickInstructions: true
            }
        };
    },
    watch: {
        'currentModel.key'(val) {
            this.$Go(`/m/quick/${val}`);
        },
        $route() {
            this.getModelQuickInstructions();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        getEmailStatus() {
            return (item) => {
                if (!item.emailVerified) return this.local('True');
                return this.local('False');
            };
        },
        getPrice() {
            return (item) => {
                if (!item) return this.local('Free');
                return '￥' + item;
            };
        },
        getDate() {
            return (item) => {
                if (typeof item !== 'object') item = new Date(item * 1000);
                return this.$SDate.Format('YYYY-mm-dd HH:MM:SS', item);
            };
        },
        computePrice() {
            return (item) => {
                if (item.completionPrice != null && item.promptPrice != null) {
                    return (
                        ((item.completionPrice + item.promptPrice) / 2 / 1e6) *
                        1e3
                    ).toFixed(3);
                } else {
                    return false;
                }
            };
        }
    },
    async mounted() {
        await this.getModels();
        this.getModelQuickInstructions();
    },
    methods: {
        async getModels() {
            await this.$api.ModelController.getModels().then((res) => {
                if (res.code === 200) {
                    let objs = res.data;
                    objs.forEach((item) => {
                        item.text = item.modelId;
                        item.key = item.id;
                        item.editable = false;
                    });
                    this.modelList = objs;
                    this.selectPathModel();
                }
            });
        },
        selectPathModel() {
            let id = this.$route.params.id;
            if (id) {
                this.currentModel = this.modelList.find(
                    (item) => item.id === id
                );
            } else this.currentModel = this.modelList[0];
        },
        async getModelQuickInstructions() {
            if (!this.currentModel.key) return;
            if (!this.lock.quickInstruction) return;
            this.lock.quickInstruction = false;
            await this.$api.ModelController.listModelQuickQuestions(
                this.currentModel.key
            ).then((res) => {
                if (res.code === 200) {
                    this.objs = res.data;
                }
                this.lock.quickInstruction = true;
            });
        },
        reviseItem(item) {
            if (!this.currentModel.key) return;
            this.$api.ModelController.updateModelQuickQuestion(
                this.currentModel.id,
                item.id,
                {
                    question: item.question,
                    tag: item.tag
                }
            ).then((res) => {
                if (res.code === 200) {
                    this.$set(item, 'editable', false);
                }
            });
        },
        async deleteQuickInstructions() {
            if (!this.currentModel.key) return;
            if (!this.lock.deleteQuickInstructions) return;
            this.$infoBox(
                this.local('Are you sure to delete these instructions ?'),
                {
                    title: this.local('Confirm Delete'),
                    status: 'error',
                    confirm: async () => {
                        this.lock.deleteQuickInstructions = false;
                        let ids = [];
                        this.currentChoosen.forEach((el) => {
                            ids.push(el.id);
                        });
                        this.$api.ModelController.removeModelQuickQuestions(
                            this.currentModel.id,
                            ids
                        )
                            .then((res) => {
                                if (res.code === 200) {
                                    this.getModelQuickInstructions();
                                }
                                this.lock.deleteQuickInstructions = true;
                            })
                            .catch((err) => {
                                console.log(err);
                                this.lock.deleteQuickInstructions = true;
                            });
                    }
                }
            );
        },
        async deleteQuickInstruction() {
            if (!this.currentModel.key) return;
            if (!this.currentItem) return;
            this.$infoBox(
                `${this.local('Are you sure to delete')}: ${
                    this.currentItem.question
                } ?`,
                {
                    title: this.local('Confirm Delete'),
                    status: 'error',
                    confirm: async () => {
                        this.$api.ModelController.removeModelQuickQuestion(
                            this.currentModel.id,
                            this.currentItem.id
                        ).then((res) => {
                            if (res.code === 200) {
                                this.getModelQuickInstructions();
                            }
                        });
                    }
                }
            );
        }
    }
};
</script>

<style lang="scss">
.m-laws-block {
    position: relative;
    height: 100%;
    flex: 1;
    background: rgba(250, 250, 250, 1);
    box-sizing: border-box;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    .row {
        position: relative;
        width: 100%;
        height: auto;
        padding: 12px;
        box-sizing: border-box;

        &.between {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &.command-bar {
            padding: 0px 12px;
            display: flex;
            align-items: center;
        }

        &.main-table {
            width: calc(100% - 24px);
            flex: 1;
            margin: 8px 12px;
            padding: 0px;
            background: white;
            border-radius: 5px;
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;

            p.highlight {
                text-align: center;
                cursor: pointer;

                &:hover {
                    color: rgba(0, 90, 158, 1);
                    text-decoration: underline;
                }
            }

            .revise-block {
                @include Vcenter;

                .text-box {
                    flex: 1;
                }
            }
        }

        &.bottom-control {
            width: calc(100% - 24px);
            height: 45px;
            margin: 8px 12px;
            padding: 0px;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .head-info {
            position: absolute;
            left: 0px;
            top: 100%;
            width: 100%;
            height: auto;
            background: whitesmoke;
            display: flex;
            flex-direction: column;
            box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.1);
            z-index: 20;

            .item {
                width: 100%;
                min-height: 35px;
                height: 35px;
                padding: 0px 15px;
                font-size: 12px;
                font-weight: 400;
                box-sizing: border-box;
                grid-template-columns: 80px 80px 80px 1fr;
                display: grid;
                align-items: center;
            }
        }
    }

    .main-title {
        @include nowrap;
        @include color-pink-blue;

        font-size: 18px;
        font-weight: 600;
        color: rgba(172, 89, 101, 0.9);
    }

    .combobox-custom-content {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .c-main-title {
            font-size: 13.8px;
            font-weight: bold;
        }

        .info-block {
            @include HbetweenVcenter;

            .max-len {
                font-size: 12px;
                color: rgba(90, 90, 90, 1);
                transform: scale(0.8);
                transform-origin: 0% 50%;
            }

            .price-block {
                @include Vcenter;

                font-size: 12px;
                color: rgba(90, 90, 90, 1);
                transform: scale(0.8);

                i {
                    color: rgba(0, 204, 153, 1);
                }
            }
        }
    }
}
</style>