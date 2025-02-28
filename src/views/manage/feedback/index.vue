<template>
    <div class="m-laws-block">
        <div class="row between">
            <h1 class="main-title">{{local('User Feedback')}}</h1>
            <fv-text-box
                v-model="currentSearch"
                :placeholder="local('Search Result')"
                icon="Search"
                borderWidth="2"
                :revealBorder="true"
                :is-box-shadow="true"
                @debounce-input="refreshData"
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
                :foreground="color"
                style="width: 100%; height: 100%"
                :multiSelection="true"
                @rightclick="currentItem = $event"
                @choose-items="addToSelected"
            >
                <template v-slot:column_0="x">
                    <p class="sec">{{ x.row_index + 1 }}</p>
                </template>
                <template v-slot:column_1="x">
                    <p
                        class="sec highlight"
                        :title="x.item.chatId"
                        @click="showCurrent(x.item)"
                    >{{ x.item.chatId }}</p>
                </template>
                <template v-slot:column_2="x">
                    <p
                        class="sec highlight"
                        :title="x.item.messageId"
                        @click="showCurrent(x.item)"
                    >{{ x.item.messageId }}</p>
                </template>
                <template v-slot:column_3="x">
                    <p
                        class="sec highlight"
                        :title="x.item.parentContent"
                        @click="showCurrent(x.item)"
                    >{{ x.item.parentContent }}</p>
                </template>
                <template v-slot:column_4="x">
                    <p
                        class="sec highlight"
                        :title="x.item.content"
                        @click="showCurrent(x.item)"
                    >{{ x.item.content }}</p>
                </template>
                <template v-slot:column_5="x">
                    <fv-tag :value="[{text: x.item.score}]"></fv-tag>
                </template>
                <template v-slot:column_6="x">
                    <p class="sec highlight">{{ x.item.comment }}</p>
                </template>
                <template v-slot:menu>
                    <div>
                        <span @click="show.feedback = true"><i
                                class="ms-Icon ms-Icon--Feedback"
                                :style="{color: color}"
                            ></i>
                            <p>{{local('User Feedback')}}</p>
                        </span>
                    </div>
                </template>
            </fv-details-list>
        </div>
        <div class="row">
            <fv-pagination
                v-model="page.current"
                :total="page.total"
                :foreground="color"
                :shadow="lock.page"
                :disabled="!lock.page"
            ></fv-pagination>
        </div>
        <detail-block
            v-model="show.feedback"
            :feedback="currentItem"
        ></detail-block>
        <selected-block
            v-model="show.selection"
            :selection.sync="currentChoosen"
        ></selected-block>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import detailBlock from '@/components/manage/feedback/detailBlock.vue';
import selectedBlock from '@/components/manage/feedback/selectedBlock.vue';

export default {
    components: {
        detailBlock,
        selectedBlock
    },
    data() {
        return {
            cmd: [
                {
                    name: () =>
                        this.local('Selected number') +
                        ' ' +
                        this.currentChoosen.length,
                    icon: 'CheckboxComposite',
                    iconColor: () => this.color,
                    func: () => {}
                },
                {
                    name: () => this.local('Show Selection'),
                    icon: 'MultiSelect',
                    iconColor: () => this.color,
                    show: () => {
                        return this.currentChoosen.length > 0;
                    },
                    func: () => {
                        this.show.selection = true;
                        for (let item of this.currentChoosen) {
                            item.choosen = false;
                            this.$set(
                                this.currentChoosen,
                                this.currentChoosen.indexOf(item),
                                item
                            );
                        }
                    }
                },
                {
                    name: () => this.local('Clear Selection'),
                    icon: 'Cancel',
                    iconColor: 'rgba(173, 38, 45, 1)',
                    show: () => {
                        return this.currentChoosen.length > 0;
                    },
                    func: () => {
                        this.currentChoosen = [];
                    }
                }
            ],
            head: [
                { content: () => this.local('No.'), width: 120 },
                {
                    content: () => this.local('Chat ID'),
                    sortName: 'chatId',
                    width: 80
                },
                {
                    content: () => this.local('Message ID'),
                    sortName: 'messageId',
                    width: 80
                },
                {
                    content: () => this.local('Query'),
                    sortName: 'parentContent',
                    width: 200
                },
                {
                    content: () => this.local('Content'),
                    sortName: 'content',
                    width: 200
                },
                {
                    content: () => this.local('Score'),
                    sortName: 'score',
                    width: 100
                },
                {
                    content: () => this.local('Comment'),
                    sortName: 'comment',
                    width: 120
                }
            ],
            objs: [],
            currentSearch: '',
            currentItem: {},
            currentChoosen: [],
            page: {
                pageSize: 50,
                current: 1,
                total: 1
            },
            show: {
                feedback: false,
                selection: false
            },
            lock: {
                page: true
            }
        };
    },
    watch: {
        'page.current'() {
            this.getFeedback();
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
        getDate() {
            return (item) => {
                if (typeof item !== 'object') item = new Date(item * 1000);
                return this.$SDate.Format('YYYY-mm-dd HH:MM:SS', item);
            };
        }
    },
    mounted() {
        this.getFeedback();
        this.getFeedbackCount();
    },
    methods: {
        async getFeedback() {
            this.$api.ModelController.queryMessages(
                this.currentSearch,
                true,
                null,
                (this.page.current - 1) * this.page.pageSize,
                this.page.pageSize
            ).then((res) => {
                if (res.code === 200) {
                    let objs = res.data.messages;
                    objs.forEach((el, idx) => {
                        if (!el.score) objs[idx].score = 0;
                        if (!el.comment) objs[idx].comment = '';
                    });
                    this.objs = objs;
                }
            });
        },
        async getFeedbackCount() {
            if (!this.lock.page) return;
            this.lock.page = false;
            this.$api.ModelController.queryMessagesCount(
                this.currentSearch,
                true
            )
                .then((res) => {
                    if (res.code === 200) {
                        this.page.total = Math.ceil(
                            res.data / this.page.pageSize
                        );
                    } else this.page.total = 1;
                    this.lock.page = true;
                })
                .catch((err) => {
                    this.lock.page = true;
                    console.log(err);
                });
        },
        refreshData() {
            this.page.current = 1;
            this.getFeedback();
            this.getFeedbackCount();
        },
        showCurrent(item) {
            this.currentItem = item;
            this.show.feedback = true;
        },
        addToSelected(event) {
            for (let item of event) {
                if (
                    this.currentChoosen.findIndex(
                        (it) => it.messageId === item.messageId
                    ) > -1
                )
                    continue;
                this.currentChoosen.push(item);
            }
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