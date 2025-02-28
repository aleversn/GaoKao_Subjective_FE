<template>
    <fv-panel
        v-model="thisValue"
        :title="local('Import Quick Instructions')"
        width="450px"
        height="auto"
        :background="theme === 'dark' ? 'rgba(36, 36, 36, 0.8)' : 'rgba(255, 255, 255, 0.6)'"
        title-size="13.8"
        :is-central-side="true"
        :is-acrylic="true"
        :is-footer="true"
    >
        <template v-slot:container>
            <div
                class="upload-quick-instruction-container"
                :class="[{dark: theme === 'dark'}]"
            >
                <div class="c-row">
                    <p class="p-title">{{local('Add Single Quick Instruction')}}</p>
                    <fv-text-box
                        v-model="single.tag"
                        underline
                        :placeholder="local('Input the Quick Instruction Tag')"
                        :border-width="2"
                        :border-color="'transparent'"
                        :focus-border-color="color"
                        :is-box-shadow="true"
                        :left-icon="'Tag'"
                        style="height: 35px; margin: 15px 0px;"
                    ></fv-text-box>
                    <fv-text-field
                        v-model="single.question"
                        underline
                        :placeholder="local('Input the Quick Instruction Content')"
                        :border-width="2"
                        :border-color="'transparent'"
                        :focus-border-color="color"
                        :is-box-shadow="true"
                        style="height: 135px; margin: 5px 0px;"
                    ></fv-text-field>
                </div>
                <div class="c-row">
                    <p class="p-title">{{local('Upload Excel') + ` (${local('Selected: ')} ${currentChoosen.length} ${local('row(s)')})`}}</p>
                </div>
                <input
                    v-show="false"
                    type="file"
                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ref="input"
                    @change="chooseFile"
                >
                <fv-button
                    theme="dark"
                    :background="color"
                    borderRadius="6"
                    icon="Table"
                    :disabled="!lock.select"
                    :is-box-shadow="true"
                    style="width: 120px; margin: 15px 0px;"
                    @click="$refs.input.click()"
                >
                    {{local('Select File')}}
                </fv-button>
                <div class="c-row main-table">
                    <fv-details-list
                        :value="current.tableList"
                        :head="current.head"
                        :multi-selection="true"
                        :foreground="color"
                        style="width: 100%; height: 300px;"
                        ref="table"
                        @choose-items="currentChoosen = $event"
                        @rightclick="contextMenuItem = $event"
                    >
                        <template v-slot:head="x">
                            <fv-text-box
                                v-model="current.head[x.index].content"
                                underline
                                :border-width="2"
                                :border-color="current.matchHeadName.includes(current.head[x.index].content) ? color : 'transparent'"
                                :focus-border-color="current.matchHeadName.includes(current.head[x.index].content) ? color : 'rgba(173, 38, 45, 1)'"
                                :is-box-shadow="true"
                                style="width: calc(100% - 30px);"
                            ></fv-text-box>
                            <fv-button
                                theme="dark"
                                background="rgba(222, 130, 128, 1)"
                                :border-radius="50"
                                fontSize="12"
                                :is-box-shadow="true"
                                :title="local('Delete Column') + ': ' + current.head[x.index].content"
                                style="position: absolute; right: 10px; width: 25px; height: 25px;"
                                @click="current.head[x.index].visible = false"
                            >
                                <i
                                    class="ms-Icon ms-Icon--Delete"
                                    style="font-size: 12px; color: whitesmoke;"
                                ></i>
                            </fv-button>
                        </template>
                        <template
                            v-for="(head, index) in current.head"
                            v-slot:[`column_${index}`]="x"
                        >
                            <fv-text-box
                                v-model="x.item[head.key]"
                                :key="head.key"
                                style="width: 100%;"
                            ></fv-text-box>
                        </template>
                        <template v-slot:menu>
                            <div>
                                <span @click="delRow(contextMenuItem)">
                                    <i
                                        class="ms-Icon ms-Icon--Delete"
                                        style="color: rgba(222, 130, 128,  1)"
                                    ></i>
                                    <p>{{local('Delete this Row')}}</p>
                                </span>
                            </div>
                        </template>
                    </fv-details-list>
                </div>
                <div class="c-row">
                    <p class="p-title">{{local(`* Please rename the tag column to 'tag', and the question name column to 'question'. Then you will see the matched text box border color turn into correct.`)}}</p>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <fv-button
                theme="dark"
                :background="color"
                :disabled="!model.id || !single.question"
                style="width: 120px; margin-left: 5px"
                @click="addQuickInstructions"
            >{{local('Add')}}</fv-button>
            <fv-button
                theme="dark"
                :background="color"
                :disabled="currentChoosen.length === 0 || !model.id"
                style="width: 120px; margin-left: 5px"
                @click="addQuickInstructions"
            >{{local('Confirm Upload')}}</fv-button>
            <fv-button
                style="width: 120px; margin-left: 5px"
                @click="thisValue = false"
            >{{local('Cancel')}}</fv-button>
        </template>
    </fv-panel>
</template>

<script>
import { mapGetters } from 'vuex';

const xlsx = require('xlsx');

export default {
    props: {
        value: {
            default: () => false
        },
        model: {
            default: () => ({})
        }
    },
    data() {
        return {
            thisValue: this.value,
            workbook: null,
            sheetNames: [],
            current: {
                name: '',
                head: [],
                tableList: [],
                matchHeadName: ['tag', 'question'],
                matchHeadKey: ['tag', 'question']
            },
            currentChoosen: [],
            contextMenuItem: {},
            single: {
                tag: '',
                question: ''
            },
            lock: {
                select: true
            }
        };
    },
    watch: {
        value(val) {
            this.thisValue = val;
        },
        thisValue(val) {
            this.$emit('input', val);
            if (val) {
                this.$refs.table.headInit();
            }
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    methods: {
        chooseFile() {
            if (!this.lock.select) return;
            this.lock.select = false;
            if (this.$refs.input.files) {
                let file = this.$refs.input.files[0];
                let reader = new FileReader();
                reader.onload = (event) => {
                    this.workbook = xlsx.read(event.target.result, {
                        type: 'binary'
                    });
                    this.sheetNames = this.workbook.SheetNames;
                    this.current.name = this.sheetNames[0];
                    this.getSheetData(this.current.name);
                    this.lock.select = true;
                };
                reader.readAsBinaryString(file);
                this.$refs.input.value = '';
            }
        },
        getSheetData(sheetName) {
            let json = xlsx.utils.sheet_to_json(
                this.workbook.Sheets[sheetName]
            );
            let head = [];
            for (let item of json) {
                for (let key in item) {
                    if (head.findIndex((it) => it.key === key) === -1) {
                        head.push({
                            content: key,
                            key: key,
                            width: 120,
                            visible: true
                        });
                    }
                }
            }
            json.forEach((el, idx) => {
                json[idx].__guid__ = this.$SUtility.Guid();
            });
            this.current.head = head;
            this.current.tableList = json;
        },
        delRow(item) {
            let index = this.current.tableList.findIndex(
                (it) => it.__guid__ === item.__guid__
            );
            this.current.tableList.splice(index, 1);
        },
        emptyRow(key) {
            for (let item of this.current.tableList) {
                if (!item[key]) return true;
                if (item[key].replace(/ +/g, '') === '') return true;
            }
            return false;
        },
        addQuickInstructions() {
            if (!this.model.id) return;
            for (let name of this.current.matchHeadName) {
                if (
                    this.current.head.findIndex((it) => it.content === name) ===
                    -1
                ) {
                    this.$barWarning(
                        this.local('Check failure') +
                            `: ${name}` +
                            this.local('not exists'),
                        {
                            status: 'warning'
                        }
                    );
                    return;
                }
                let tableKey = this.current.head.find(
                    (it) => it.content === name
                ).key;
                if (this.emptyRow(tableKey)) {
                    this.$barWarning(
                        this.local('Check failure') +
                            `: ${name}` +
                            this.local('contain empty row'),
                        {
                            status: 'warning'
                        }
                    );
                    return;
                }
            }
            let data = [];
            for (let item of this.currentChoosen) {
                let cur = {};
                for (let i = 0; i < this.current.matchHeadName.length; i++) {
                    let name = this.current.matchHeadName[i];
                    let key = this.current.matchHeadKey[i];
                    let tableKey = this.current.head.find(
                        (it) => it.content === name
                    ).key;
                    cur[key] = item[tableKey].replace(/ +/g, '');
                }
                data.push(cur);
            }
            this.$api.ModelController.addModelQuickQuestions(
                this.model.id,
                data
            ).then((res) => {
                if (res.code === 200) {
                    this.thisValue = false;
                    this.$emit('finished');
                } else {
                    this.$barWarning(res.msg, {
                        status: 'warning'
                    });
                }
            });
        },
        addQuickInstruction() {
            if (!this.model.id) return;
            if (!this.single.question) return;
            this.$api.ModelController.addModelQuickQuestion(this.model.id, {
                tag: this.single.tag,
                question: this.single.question
            }).then((res) => {
                if (res.code === 200) {
                    this.$emit('finished');
                } else {
                    this.$barWarning(res.msg, {
                        status: 'warning'
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss">
.upload-quick-instruction-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px;
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    font-weight: 400;
    box-sizing: border-box;

    &.dark
    {
        
    }

    .p-title {
        margin-top: 25px;
        font-size: 13.8px;
        color: rgba(129, 137, 169, 1);
        font-weight: 400;
    }

    .r-row {
        @include Vcenter;

        position: relative;
        width: 100%;
        height: auto;
        box-sizing: border-box;
    }

    .c-row {
        position: relative;
        width: 100%;
        height: auto;
        box-sizing: border-box;

        &.main-table {
            width: 100%;
            height: 100%;
            flex: 1;
            margin: 8px 0px;
            padding: 0px;
            border: rgba(120, 120, 120, 0.3) solid thin;
            border-radius: 5px;
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
    }
}
</style>