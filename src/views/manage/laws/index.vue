<template>
    <div class="m-laws-block">
        <div class="row between">
            <h1 class="main-title">{{local('Laws Management')}}</h1>
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
                style="flex: 1"
            ></fv-command-bar>
        </div>
        <div class="row main-table">
            <fv-details-list
                v-model="objs"
                :head="head"
                :filter="currentSearch"
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
                        :title="x.item.id"
                        class="highlight"
                        @click="$Go(`/user/res/list/${x.item.id}`)"
                    >{{ x.item.id }}</p>
                </template>
                <template v-slot:column_2="x">
                    <p
                        class="highlight"
                        @click="ShowRevise(x.item)"
                    >{{ x.item.name }}</p>
                </template>
                <template v-slot:column_3="x">
                    <p class="sec">{{ getUserName(x.item) }}</p>
                </template>
                <template v-slot:column_4="x">
                    <p class="sec">{{ x.item.publish_time }}</p>
                </template>
                <template v-slot:column_5="x">
                    <fv-tag
                        :value="x.item.prop ? [{text: x.item.prop}]: []"
                        @click.native="ShowRevise(x.item)"
                    ></fv-tag>
                </template>
                <template v-slot:menu>
                    <div>
                        <span @click="show.addDict = true"><i
                                class="m-icon"
                                style="color: rgba(0, 90, 158, 1);"
                            >&#xE109;</i>
                            <p>添加目录</p>
                        </span>
                        <span @click="ShowRevise(currentItem)"><i
                                class="m-icon"
                                style="color: rgba(0, 90, 158, 1);"
                            >&#xE104;</i>
                            <p>修改目录</p>
                        </span>
                        <span @click="delDict(currentItem)"><i
                                class="m-icon"
                                style="color: rgba(173, 38, 45, 1);"
                            >&#xE107;</i>
                            <p>删除目录</p>
                        </span>
                        <hr style="margin: 8px 15px; border: thin; border-bottom: rgba(0, 0, 0, 0.1) solid thin" />
                        <span @click="$Go(`/user/res/list/${currentItem.id}`)"><i
                                class="m-icon"
                                style="color: rgba(0, 90, 158, 1);"
                            >&#xF57E;</i>
                            <p>查看目录资源</p>
                        </span>
                    </div>
                </template>
            </fv-details-list>
        </div>
        <add-dict
            v-model="show.addDict"
            @finished="getResDicts"
            @close="show.addDict = false"
        ></add-dict>
        <revise-dict
            v-model="show.reviseDict"
            :obj="currentItem"
            @finished="getResDicts"
            @close="show.reviseDict = false"
        ></revise-dict>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import addDict from '@/components/addResDict.vue';
import reviseDict from '@/components/reviseResDict.vue';

export default {
    components: {
        addDict,
        reviseDict
    },
    data() {
        return {
            cmd: [
                {
                    name: '添加目录',
                    icon: 'Add',
                    iconColor: 'rgba(0, 90, 158, 1)',
                    func: () => {
                        this.show.addDict = true;
                    }
                },
                {
                    name: '删除目录',
                    icon: 'Delete',
                    iconColor: 'rgba(173, 38, 45, 1)',
                    disabled: () => this.currentChoosen.length <= 0,
                    func: () => {
                        this.delDicts();
                    }
                }
            ],
            head: [
                { content: '序号', width: 120 },
                { content: 'id', sortName: 'id', width: 150 },
                { content: '标题', sortName: 'name', width: 250 },
                { content: '发布人', width: 150 },
                { content: '发布时间', sortName: 'publish_time', width: 200 },
                { content: '版块', width: 200, sortName: 'prop' }
            ],
            objs: [],
            currentSearch: '',
            currentItem: {},
            currentChoosen: [],
            show: {
                addDict: false,
                reviseDict: false
            }
        };
    },
    computed: {
        ...mapGetters(['local'])
    },
    mounted() {
        this.getResDicts();
    },
    methods: {
        getResDicts() {
            this.$api.Res.GetDicts().then((data) => {
                this.objs = data;
            });
            this.show.addDict = false;
            this.show.reviseDict = false;
        },
        getUserName(item) {
            if (item.userInfo == undefined) return item.publisher;
            else return item.userInfo.name;
        },
        reviseType(obj) {
            this.$api.News.ReviseInfo(
                this.objs[obj.value].id,
                undefined,
                this.objs[obj.value].title,
                undefined,
                undefined,
                undefined,
                undefined,
                obj.currentIndex == 0 ? 'video' : 'draw_video'
            ).then((data) => {
                if (data.status == 'success') {
                    this.getResDicts();
                } else {
                    this.$barWarning(data.status, { status: 'warning' });
                }
            });
        },
        delDict(item) {
            let el = this;
            this.$infoBox(`你将移除${item.name}，但系统其下的资源`, {
                title: '确定删除',
                status: 'error',
                confirm: () => {
                    this.$api.Res.DelDict(item.id).then((data) => {
                        if (data.status == 'success') {
                            this.$barWarning('删除成功', {
                                status: 'correct'
                            });
                            el.getResDicts();
                        } else
                            this.$barWarning(data.status, {
                                status: 'warning'
                            });
                    });
                }
            });
        },
        delDicts() {
            let el = this;
            if (this.currentChoosen.length == 0) {
                this.$barWarning('当前没有选择任何目录', { status: 'warning' });
                return 0;
            }
            this.$infoBox(`你将移除所选择的目录，但系统将保留其下的资源`, {
                title: '确定删除',
                status: 'error',
                confirm: () => {
                    let promises = [];
                    for (let item of this.currentChoosen) {
                        promises.push(this.$api.Res.DelDict(item.id));
                    }
                    Promise.all(promises).then((data) => {
                        this.$barWarning('删除成功', {
                            status: 'correct'
                        });
                        this.getResDicts();
                    });
                }
            });
        },
        ShowRevise(item) {
            this.show.reviseDict = true;
            this.currentItem = item;
        }
    }
};
</script>

<style lang="scss">
.m-laws-block {
    position: relative;
    height: 100%;
    flex: 1;
    background: rgba(239, 239, 239, 1);
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
        @include color-blue-dark;

        font-size: 18px;
        font-weight: 600;
        color: rgba(172, 89, 101, 0.9);
    }
}
</style>