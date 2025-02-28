<template>
    <fv-panel
        v-model="thisValue"
        :title="local('Chat Feedback')"
        width="550px"
        height="auto"
        background="rgba(255, 255, 255, 0.6)"
        title-size="13.8"
        :is-central-side="true"
        :is-acrylic="true"
        :is-footer="true"
    >
        <template v-slot:container>
            <div class="panel-container">
                <p class="panel-title">{{local('Selected Messages')}}</p>
                <div class="row command-bar">
                    <fv-command-bar
                        :options="cmd"
                        background="transparent"
                        style="flex: 1"
                    ></fv-command-bar>
                </div>
                <div class="row main-table">
                    <fv-details-list
                        v-model="thisSelection"
                        :head="head"
                        :foreground="color"
                        ref="table"
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
            </div>
        </template>
        <template v-slot:footer>
            <fv-button
                style="width: 120px; margin-left: 5px"
                @click="thisValue = false"
            >{{local('Cancel')}}</fv-button>
        </template>
    </fv-panel>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        value: {
            default: false
        },
        selection: {
            default: () => []
        }
    },
    data() {
        return {
            thisValue: this.value,
            thisSelection: this.selection,
            cmd: [
                {
                    name: () =>
                        this.local('Total number') +
                        ' ' +
                        this.thisSelection.length,
                    icon: 'Message',
                    iconColor: () => this.color,
                    func: () => {}
                },
                {
                    name: () => this.local('Remove'),
                    icon: 'Remove',
                    iconColor: 'rgba(173, 38, 45, 1)',
                    show: () => this.currentChoosen.length > 0,
                    func: () => {
                        for (let item of this.currentChoosen) {
                            let index = this.thisSelection.findIndex(
                                (it) => it.messageId === item.messageId
                            );
                            if (index > -1) this.thisSelection.splice(index, 1);
                        }
                    }
                },
                {
                    name: () => this.local('Export'),
                    icon: 'Download',
                    iconColor: () => this.color,
                    show: () => this.thisSelection.length > 0,
                    func: () => {
                        this.exportData();
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
            currentItem: {},
            currentChoosen: []
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
            if (val) this.$refs.table.headInit();
        },
        thisValue(val) {
            this.$emit('input', val);
        },
        selection(val) {
            this.thisSelection = val;
        },
        thisSelection(val) {
            this.$emit('update:selection', val);
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.globalAppendInit();
    },
    methods: {
        globalAppendInit() {
            this.$nextTick(() => {
                const body = document.querySelector('body');
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
            });
        },
        downloadTxtFile(text, filename) {
            // 创建一个新的 Blob 对象，用于存储文本内容
            const blob = new Blob([text], { type: 'text/plain' });

            // 创建一个 <a> 元素
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);

            // 设置文件名
            a.download = filename;

            // 模拟点击下载链接
            a.click();

            // 释放 URL 对象
            URL.revokeObjectURL(a.href);
        },
        exportData() {
            let result = [];
            let sample = this.thisSelection[0];
            let row = [];
            for (let key in sample) {
                row.push(this.local(key));
            }
            result.push(row.join('\t'));
            for (let item of this.thisSelection) {
                row = [];
                for (let key in item) row.push(JSON.stringify(item[key]));
                result.push(row.join('\t'));
            }
            this.downloadTxtFile(result.join('\n'), 'Export.csv');
        }
    }
};
</script>

<style lang="scss">
.panel-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px 15px 55px 15px;
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    font-weight: 400;
    line-height: 2;

    .panel-title {
        margin-top: 5px;
        font-size: 16px;
        font-weight: bold;
    }

    .panel-row {
        position: relative;
        margin: 10px 0px;
        padding: 0px 5px;
        display: flex;
        align-items: center;

        .email-info {
            @include Vcenter;

            margin-top: 5px;
        }
    }

    .feedback-power-editor {
        width: 100%;
        min-height: 150px;
        height: auto;
        max-height: 300px;
        border: rgba(200, 200, 200, 0.1) solid thin;
        overflow: hidden;
    }
}
</style>