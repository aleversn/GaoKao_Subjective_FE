<template>
    <div class="m-laws-block">
        <div class="row between">
            <h1 class="main-title">{{local('Models Management')}}</h1>
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
                    <fv-tag :value="x.item.maxLength ? [{text: x.item.maxLength}]: []"></fv-tag>
                </template>
                <template v-slot:column_4="x">
                    <fv-tag :value="getPrice(x.item.promptPrice) ? [{text: getPrice(x.item.promptPrice), background: color}]: []"></fv-tag>
                </template>
                <template v-slot:column_5="x">
                    <fv-tag :value="getPrice(x.item.completionPrice) ? [{text: getPrice(x.item.completionPrice), background: color}]: []"></fv-tag>
                </template>
                <template v-slot:column_6="x">
                    <p class="sec">{{ getDate(x.item.updatedAt) }}</p>
                </template>
                <template v-slot:column_7="x">
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
                    </div>
                </template>
            </fv-details-list>
        </div>
        <model-info
            v-model="show.modelInfo"
            :model="currentItem"
        ></model-info>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import modelInfo from '@/components/manage/models/modelInfo.vue';

export default {
    components: {
        modelInfo
    },
    data() {
        return {
            cmd: [
                {
                    name: () =>
                        this.local('Model number') + ' ' + this.objs.length,
                    icon: 'DialShape3',
                    iconColor: () => this.color,
                    func: () => {}
                }
            ],
            head: [
                { content: () => this.local('No.'), width: 120 },
                { content: 'id', sortName: 'id', width: 80 },
                {
                    content: () => this.local('Model ID'),
                    sortName: 'modelId',
                    width: 200
                },
                {
                    content: () => this.local('Max Len'),
                    sortName: 'maxLength',
                    width: 120
                },
                {
                    content: () => this.local('Prompt Price'),
                    sortName: 'promptPrice',
                    width: 120
                },
                {
                    content: () => this.local('Completion Price'),
                    sortName: 'completionPrice',
                    width: 120
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
            currentSearch: '',
            currentItem: {},
            currentChoosen: [],
            show: {
                modelInfo: false
            }
        };
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
        }
    },
    mounted() {
        this.getModels();
    },
    methods: {
        getModels() {
            this.$api.ModelController.getModels().then((res) => {
                if (res.code === 200) this.objs = res.data;
            });
        },
        showModelInfo(item) {
            this.currentItem = item;
            this.show.modelInfo = true;
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
}
</style>