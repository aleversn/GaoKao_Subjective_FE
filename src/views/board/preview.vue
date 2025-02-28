<template>
    <div class="main-preview">
        <div class="msg-input">
            <fv-button @click="$refs.input.click()">Open</fv-button>
            <input
                v-show="false"
                type="file"
                accept=".json,.jsonl"
                ref="input"
                @change="readFile"
            />
        </div>
        <div class="sample-list">
            <div
                class="sample-item"
                v-for="(item, index) in pageList"
                :key="index"
            >
                <p class="split-title">
                    No.{{ (page - 1) * page_num + index + 1 }}:
                    {{ item.keywords }}
                </p>
                <editor-item :value="item" :theme="theme"></editor-item>
                <p class="split-title">学生作答</p>
                <editor-item
                    :value="item"
                    :decode_key="'bad_student_answer'"
                    :theme="theme"
                ></editor-item>
                <p class="split-title">参考答案</p>
                <editor-item
                    :value="item"
                    :decode_key="'answer'"
                    :theme="theme"
                ></editor-item>
                <p class="split-title">得分: {{ item.score }}</p>
            </div>
        </div>
        <div v-if="pages > 0" class="bottom-line">
            <fv-Pagination
                v-model="page"
                :total="pages"
                background="whitesmoke"
                :shadow="true"
            >
            </fv-Pagination>
            <fv-text-box
                v-model="inputValue"
                underline
                :placeholder="'Set Page'"
                :border-width="2"
                :border-color="'transparent'"
                :focus-border-color="color"
                :font-size="12"
                :is-box-shadow="true"
                :icon="'Search'"
                @keyup.enter="page = parseInt(inputValue)"
                style="width: 80px; height: 35px; margin-left: 15px"
            ></fv-text-box>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import editorItem from '@/components/board/editorItem.vue';

export default {
    components: {
        editorItem
    },
    data() {
        return {
            page: 1,
            page_num: 10,
            inputValue: '1',
            value: [],
            thisValue: {
                content: ''
            }
        };
    },
    watch: {
        page() {
            this.inputValue = this.page.toString();
        }
    },
    computed: {
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        pageList() {
            return this.value.slice(
                (this.page - 1) * this.page_num,
                (this.page - 1) * this.page_num + this.page_num
            );
        },
        pages() {
            return Math.ceil(this.value.length / this.page_num);
        }
    },
    methods: {
        readFile() {
            let files = this.$refs.input.files;
            if (files.length > 0) {
                let file = files[0];
                let reader = new FileReader();
                reader.onload = (e) => {
                    let problemList = e.target.result.split('\n');
                    if (problemList.slice(-1)[0] == '')
                        problemList = problemList.slice(0, -1);
                    problemList.forEach((item, index) => {
                        problemList[index] = JSON.parse(problemList[index]);
                    });
                    this.value = problemList;
                };
                reader.readAsText(file);
            }
        }
    }
};
</script>

<style lang="scss">
.main-preview {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .msg-input {
        @include Vend;

        position: relative;
        width: 100%;
        height: 120px;
    }

    .sample-list {
        position: relative;
        width: 100%;
        flex: 1;
        padding: 0px 5px;
        overflow: overlay;

        .sample-item {
            position: relative;
            width: 100%;
            margin-top: 5px;
            padding: 15px;
            border: rgba(200, 200, 200, 0.1) solid thin;

            .split-title {
                font-weight: bold;
            }

            .msg-power-editor {
                width: 100%;
                height: auto;
                overflow: hidden;
            }
        }
    }

    .bottom-line {
        @include HcenterVcenter;

        position: relative;
        width: 100%;
        height: 50px;
    }
}
</style>
