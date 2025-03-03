<template>
    <div class="main-preview">
        <div class="msg-input">
            <fv-Pivot
                v-model="currentCourse"
                :items="courseList"
                :tab="true"
                :font-size="12"
                :sliderBoxshadow="true"
                :background="'rgba(238, 238, 239, 1)'"
                style="width: 100%"
            ></fv-Pivot>
        </div>
        <div v-if="currentCourse && currentErrors" class="score-info">
            <p style="margin-right: 15px">学科: {{ currentCourse.name }}</p>
            <p style="margin-right: 5px">
                评测进度: {{ labeledCount }} /
                {{ labeledCount + unlabeledCount }}
            </p>
            <fv-progress-ring
                :value="
                    parseInt(
                        (labeledCount / (labeledCount + unlabeledCount)) * 100
                    )
                "
                r="15"
                borderWidth="3"
            ></fv-progress-ring>
            <fv-Combobox
                v-model="showValue"
                :options="showOptions"
                placeholder="筛选器"
                style="width: 120px; height: 30px; margin-left: 15px"
            >
            </fv-Combobox>
        </div>
        <div ref="scoller" class="sample-list">
            <div
                v-if="currentCourse && currentErrors"
                class="description-block"
            >
                <h2 class="title">
                    感谢您参与我们的研究。当前学科是: {{ currentCourse.name }}
                </h2>
                <span>
                    <p>
                        在我们搭建的评测网站<a href="http://gaokao.fzuacm.com"
                            >gaokao.fzuacm.com</a
                        >中，您看到的【题目】均出自2010-2022年间的高考真题，【作答】均由<strong>人工智能大模型</strong>完成。
                    </p>

                    <blockquote>
                        <p>
                            在这些“答案”中，有一些是由AI模型扮演“考生”正常作答，更多的则是由AI模型扮演“差生”在已知参考答案的前提下，按照常见错因故意生成的错误答案。
                        </p>
                    </blockquote>

                    <p>
                        您将<strong>扮演“高考阅卷教师”</strong>的角色，按照中学考试阅卷中的正常流程，依照每道题给出的参考答案，为这些“AI考生”的作答给出评分。
                    </p>

                    <h3 style="text-align: start">具体操作内容如下：</h3>
                    <ol style="padding: 0px 15px; box-sizing: border-box">
                        <li>
                            <p>
                                <strong
                                    style="
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    >选择学科模块: </strong
                                >您需要在最上方的<strong
                                    style="
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    ><span style="color: #958df1"
                                        >导航栏</span
                                    ></strong
                                >选择自己<strong>学科对应的评分模块</strong>。
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong
                                    style="
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    >评总分和步骤分: </strong
                                >对于每道题，我们给出了参考答案和该题总分，并<strong>将学生作答划分为了若干个步骤</strong>。您需要对<strong>划分后的步骤</strong>进行评分，如该步骤有错误，您需要<strong>在评步骤分的同时，选择我们预设好的“错误原因”</strong>。
                            </p>
                            <ul style="padding: 0px 15px">
                                <li>
                                    <p>
                                        程序是按照“换行Enter”进行步骤的自动切分，所以这里的“步骤1”、“步骤2”……可能并不代表实际解题中的步骤。
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        请注意！<strong
                                            >所有的“步骤分”都指的是该步骤的“区间得分”，而非截止到当前步骤的“累计分”！</strong
                                        >
                                    </p>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <p>
                                <strong
                                    style="
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    >计算总分: </strong
                                >评完所有步骤分后，可以点击<strong>“累计步骤分”</strong>，系统将自动计算该题总分。您也可以进一步修改总分。该题评分完成后，该题的标签会由<mark
                                    data-color="#ffa8a8"
                                    style="
                                        background-color: #ffa8a8;
                                        color: inherit;
                                    "
                                    >红色</mark
                                >变为<mark
                                    data-color="#8ce99a"
                                    style="
                                        background-color: #8ce99a;
                                        color: inherit;
                                    "
                                    >绿色</mark
                                >。
                            </p>
                        </li>
                    </ol>
                    <h5>
                        您可以在导航栏下方看到自己的评测进度。可以选择切换【全部作答】、【已评分】、【未评分】。
                    </h5>
                </span>
                <h3 class="split-title" style="margin: 5px 0px">
                    该学科包含以下常见错误类型:
                </h3>
                <div
                    v-for="(error, eidx) in currentErrors.errors"
                    :key="eidx"
                    style="
                        width: auto;
                        padding: 15px;
                        margin: 10px 0px;
                        background: rgba(180, 159, 233, 0.3);
                        color: rgba(50, 49, 48, 1);
                        border-radius: 6px;
                        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
                    "
                >
                    <h3>
                        {{ error.name }}
                    </h3>
                    <p style="font-size: 13px;">{{ error.description }}</p>
                </div>
            </div>
            <div
                class="sample-item"
                v-for="(item, index) in pageList"
                :key="index"
            >
                <div class="question-info">
                    <div class="left-block">
                        <p
                            class="question-title"
                            :class="[
                                {
                                    scored:
                                        item.scoreItem && item.scoreItem.scored
                                }
                            ]"
                            :title="item.keywords"
                        >
                            No.{{ (page - 1) * page_num + index + 1 }}:
                        </p>
                        <p class="question-title" style="margin-left: 5px">
                            题目标识ID: {{ item.id }}
                        </p>
                    </div>
                    <p class="score-title">分值: {{ item.score }}</p>
                </div>
                <editor-item
                    :value="item"
                    :theme="theme"
                    style="font-size: 15px"
                ></editor-item>
                <p class="split-title">学生作答</p>
                <div
                    v-for="(seg, si) in item.bad_student_answer_segs"
                    :key="si"
                    class="std-answer-block"
                >
                    <div class="ctl-block">
                        <p class="step-title">步骤 {{ si + 1 }}</p>
                    </div>
                    <editor-item
                        :value="item"
                        :decode_key="seg"
                        :mode="true"
                        :theme="theme"
                    ></editor-item>
                    <div v-if="item.scoreItem" class="ctl-block">
                        <seg-score-block
                            :value="item"
                            :idx="si"
                            :errors="currentErrors"
                            :lock="isLock"
                            @confirm="update_score(item)"
                        ></seg-score-block>
                    </div>
                </div>
                <div v-if="item.scoreItem" class="total-score-info">
                    <div class="left-block">
                        <fv-text-box
                            v-model="item.scoreItem.label"
                            underline
                            :placeholder="'请打分'"
                            :border-width="2"
                            :border-color="'transparent'"
                            :focus-border-color="color"
                            :font-size="12"
                            :disabled="!item.showTotalScore || !isLock"
                            :is-box-shadow="true"
                            :icon="'Tag'"
                            :ref="`label_${index}`"
                            @keyup.enter="updateScoreClick(item, index)"
                            style="width: 80px; height: 35px"
                        ></fv-text-box>
                        <fv-button
                            :icon="'MergeCall'"
                            :border-radius="6"
                            :disabled="
                                (!item.scoreItem.label &&
                                    item.showTotalScore) ||
                                !isLock
                            "
                            :is-box-shadow="true"
                            style="width: 120px; height: 35px; margin-left: 5px"
                            @click="sumScore(item)"
                            >累积步骤分</fv-button
                        >
                        <fv-button
                            theme="dark"
                            :background="
                                item.showTotalScore
                                    ? 'rgba(0, 204, 158, 1)'
                                    : 'rgba(163, 159, 233, 1)'
                            "
                            :icon="item.showTotalScore ? 'Accept' : 'Edit'"
                            :border-radius="6"
                            :disabled="
                                (!item.scoreItem.label &&
                                    item.showTotalScore) ||
                                !isLock
                            "
                            :is-box-shadow="true"
                            style="width: 100px; height: 35px; margin-left: 5px"
                            @click="updateScoreClick(item, index)"
                            >{{
                                item.showTotalScore ? '确认打分' : '修改总分'
                            }}</fv-button
                        >
                    </div>
                    <p class="score-title">分值: {{ item.score }}</p>
                </div>
                <p class="split-title">参考答案</p>
                <editor-item
                    :value="item"
                    :decode_key="'answer'"
                    :editorBackground="'rgba(220, 219, 239, 0.1)'"
                    :theme="theme"
                ></editor-item>
            </div>
        </div>
        <div v-if="pages > 0" class="bottom-line">
            <fv-Pagination
                v-model="page"
                :total="pages"
                background="whitesmoke"
                :disabled="!isLock"
                :shadow="true"
            >
            </fv-Pagination>
            <fv-text-box
                v-model="inputValue"
                underline
                :placeholder="'Set Page'"
                :disabled="!isLock"
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
import axios from '@/api/gaokao.js';
import editorItem from '@/components/score/editorItem.vue';
import segScoreBlock from '@/components/score/segScoreBlock.vue';

export default {
    components: {
        editorItem,
        segScoreBlock
    },
    data() {
        return {
            page: 1,
            page_num: 10,
            inputValue: '1',
            value: [],
            errorTypes: [],
            qTypeDict: {
                gapfilling: '填空题',
                ShortAns: '简答题',
                Choice: '选择题'
            },
            showValue: { key: 'all', text: '全部作答' },
            showOptions: [
                { key: 'title', text: '选择可视范围', type: 'header' },
                { key: 'all', text: '全部作答' },
                { key: 'scored', text: '已评分' },
                { key: 'unscored', text: '未评分' }
            ],
            currentCourse: null,
            courseList: [],
            thisValue: {
                content: ''
            },
            lock: {
                loadingCourse: true,
                loadingErrorTypes: true,
                loadingQuestion: true,
                scores: true
            }
        };
    },
    watch: {
        currentCourse() {
            this.page = 1;
            this.$nextTick(() => {
                this.getQuestionList();
            });
        },
        'showValue.key'() {
            this.page = 1;
        },
        page() {
            this.inputValue = this.page.toString();
            this.$refs.scoller.scrollTop = 0;
        }
    },
    computed: {
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        filterValue() {
            if (this.showValue.key === 'all') {
                return this.value;
            } else if (this.showValue.key === 'scored') {
                return this.value.filter(
                    (it) => it.scoreItem && it.scoreItem.scored
                );
            } else
                return this.value.filter(
                    (it) => !it.scoreItem || !it.scoreItem.scored
                );
        },
        pageList() {
            return this.filterValue.slice(
                (this.page - 1) * this.page_num,
                (this.page - 1) * this.page_num + this.page_num
            );
        },
        pages() {
            return Math.ceil(this.filterValue.length / this.page_num);
        },
        currentErrors() {
            let id = this.currentCourse.key;
            let item = this.errorTypes.find((item) => item.q_id == id);
            if (item) return item;
            return null;
        },
        unlabeledCount() {
            let count = 0;
            this.value.forEach((item, index) => {
                if (item.scoreItem && !item.scoreItem.scored) count++;
            });
            return count;
        },
        labeledCount() {
            let count = 0;
            this.value.forEach((item, index) => {
                if (item.scoreItem && item.scoreItem.scored) count++;
            });
            return count;
        },
        isLock() {
            for (let type in this.lock) {
                if (!this.lock[type]) return false;
            }
            return true;
        }
    },
    mounted() {
        this.getCourses();
        this.getErrorTypes();
    },
    methods: {
        getCourses() {
            if (!this.lock.loadingCourse) return;
            this.lock.loadingCourse = false;
            axios({
                method: 'get',
                url: '/get_question_types'
            })
                .then((res) => {
                    res = res.data;
                    if (res.code === 200) {
                        let courseList = res.data;
                        courseList.forEach((course) => {
                            course.key = course.id;
                            course.name =
                                course.name +
                                '(' +
                                this.qTypeDict[course.type.split('.')[0]] +
                                ')';
                            course.width = 80;
                        });
                        courseList.sort(
                            (a, b) => -a.name.localeCompare(b.name)
                        );

                        this.courseList = courseList;
                    } else
                        this.$barWarning(res.message, {
                            status: 'warning'
                        });
                    this.lock.loadingCourse = true;
                })
                .catch((err) => {
                    this.$barWarning(err, {
                        status: 'error'
                    });
                    this.lock.loadingCourse = true;
                });
        },
        getErrorTypes() {
            if (!this.lock.loadingErrorTypes) return;
            this.lock.loadingErrorTypes = false;
            axios({
                method: 'get',
                url: '/get_error_types'
            })
                .then((res) => {
                    res = res.data;
                    if (res.code === 200) {
                        this.errorTypes = res.data;
                    } else
                        this.$barWarning(res.message, {
                            status: 'warning'
                        });
                    this.lock.loadingErrorTypes = true;
                })
                .catch((err) => {
                    this.$barWarning(err, {
                        status: 'error'
                    });
                    this.lock.loadingErrorTypes = true;
                });
        },
        getQuestionList() {
            if (!this.lock.loadingQuestion) return;
            if (!this.currentCourse) return;
            if (!this.currentCourse.key) return;
            this.lock.loadingQuestion = false;
            axios({
                method: 'get',
                url: '/get_question_list?id=' + this.currentCourse.key
            })
                .then((res) => {
                    res = res.data;
                    if (res.code === 200) {
                        let dataList = res.data;
                        dataList.forEach((item, index) => {
                            item.scoreItem = null;
                            item.showTotalScore = false;
                            if (!item.bad_student_answer_segs)
                                item.bad_student_answer_segs = [];
                        });
                        this.value = dataList;
                        this.getQuestionScores();
                    } else
                        this.$barWarning(res.message, {
                            status: 'warning'
                        });
                    this.lock.loadingQuestion = true;
                })
                .catch((err) => {
                    this.$barWarning(err, {
                        status: 'error'
                    });
                    this.lock.loadingQuestion = true;
                });
        },
        getQuestionScores() {
            if (!this.currentCourse) return;
            if (!this.currentCourse.key) return;
            if (!this.lock.scores) return;
            this.lock.scores = false;
            axios({
                method: 'get',
                url: `/get_scores?id=${this.currentCourse.key}&course=${this.currentCourse.course}&c_type=${this.currentCourse.course_type}`
            })
                .then((res) => {
                    res = res.data;
                    if (res.code === 200) {
                        let scoresList = res.data;
                        scoresList.forEach((item, index) => {
                            if (!item.scoreItem) {
                                item.scoreItem = {
                                    userid: '',
                                    username: '',
                                    label: '',
                                    comments: '',
                                    seg_labels: [],
                                    scored: false
                                };
                            } else {
                                item.scoreItem.label =
                                    item.scoreItem.label.toString();
                                item.scoreItem.scored = true;
                                try {
                                    item.scoreItem.seg_labels = JSON.parse(
                                        item.scoreItem.seg_labels
                                    );
                                } catch (e) {
                                    item.scoreItem.seg_labels = [];
                                }
                            }
                            let fidx = this.value.findIndex(
                                (v) => v.id === item.id
                            );
                            this.$set(
                                this.value[fidx],
                                'scoreItem',
                                item.scoreItem
                            );
                        });
                    } else
                        this.$barWarning(res.message, {
                            status: 'warning'
                        });
                    this.lock.scores = true;
                })
                .catch((err) => {
                    this.$barWarning(err, {
                        status: 'error'
                    });
                    this.lock.scores = true;
                });
        },
        update_score(item) {
            if (!this.lock.scores) return;
            this.lock.scores = false;
            axios
                .post(
                    '/update_score',
                    {
                        course_id: this.currentCourse.key,
                        course: this.currentCourse.course,
                        course_type: this.currentCourse.course_type,
                        question_id: item.id,
                        label: item.scoreItem.label
                            ? item.scoreItem.label
                            : '0',
                        comments: '',
                        user_id: '',
                        user_name: '',
                        seg_labels: JSON.stringify(item.scoreItem.seg_labels)
                    },
                    {
                        headers: {
                            'Api-key': 'creatorsn.com'
                        }
                    }
                )
                .then((res) => {
                    res = res.data;
                    if (res.code === 200) {
                        this.$barWarning('更新成功', {
                            status: 'correct'
                        });
                        this.$set(item.scoreItem, 'scored', true);
                    } else {
                        this.$barWarning(res.message, {
                            status: 'warning'
                        });
                    }
                    this.lock.scores = true;
                })
                .catch((err) => {
                    this.$barWarning(err, {
                        status: 'error'
                    });
                    this.lock.scores = true;
                });
        },
        sumScore(item) {
            if (!item.scoreItem.seg_labels) return;
            let count = 0;
            console.log(item.scoreItem.seg_labels)
            for (let segItem of item.scoreItem.seg_labels) {
                if (parseInt(segItem.label).toString() !== 'NaN') {
                    count += parseInt(segItem.label);
                }
            }
            let index = this.value.findIndex((it) => it.id === item.id);
            item.scoreItem.label = count.toString();
            this.$set(this.value, index, item);
            this.update_score(item);
        },
        updateScoreClick(item, index) {
            if (item.showTotalScore) this.update_score(item);
            this.$set(item, 'showTotalScore', !item.showTotalScore);
            if (item.showTotalScore) {
                this.$nextTick(() => {
                    if (this.$refs[`label_${index}`][0])
                        this.$refs[`label_${index}`][0].focus();
                });
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
    background: rgba(250, 250, 250, 1);
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .msg-input {
        @include Vend;

        position: relative;
        width: 100%;
        height: 120px;
        padding: 0px 5px;
    }

    .score-info {
        @include Vcenter;

        position: relative;
        width: 100%;
        max-width: 1024px;
        height: 35px;
        padding: 0px 10px;
        font-weight: bold;
        background: rgba(250, 250, 250, 1);
        border-radius: 6px;
        user-select: none;
    }

    .sample-list {
        position: relative;
        width: 100%;
        max-width: 1024px;
        flex: 1;
        padding: 0px 5px;
        overflow: overlay;

        .description-block {
            position: relative;
            width: 100%;
            height: auto;
            padding: 15px;
            margin: 5px 0px;
            background: rgba(200, 200, 200, 0.1);
            border-radius: 12px;
            line-height: 2;

            strong {
                font-weight: 400;
                text-decoration: underline;
            }
        }

        .sample-item {
            position: relative;
            width: 100%;
            margin-top: 20px;
            margin-bottom: 5px;
            padding: 15px;
            background: rgba(255, 255, 255, 1);
            border: rgba(200, 200, 200, 0.2) solid thin;
            border-radius: 8px;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

            .question-info {
                @include HbetweenVcenter;

                .left-block {
                    @include Vcenter;
                }
            }

            .total-score-info {
                @include HbetweenVcenter;

                padding: 15px 0px;
                margin: 15px 0px;
                border: rgba(200, 200, 200, 0.6) dashed 1px;
                border-left: none;
                border-right: none;
                border-bottom: none;

                .left-block {
                    @include Vcenter;
                }
            }

            .std-answer-block {
                position: relative;
                width: 100%;
                display: flex;

                .ctl-block {
                    @include Hcenter;

                    position: relative;
                    min-width: 50px;
                    width: 50px;
                    padding-top: 35px;

                    .step-title {
                        @include HcenterVcenter;

                        position: relative;
                        width: 120px;
                        height: 25px;
                        background: rgba(246, 175, 75, 1);
                        color: rgba(50, 49, 48, 1);
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 6px;
                        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
                        user-select: none;
                    }
                }
            }

            .split-title {
                font-weight: bold;
            }

            .question-title {
                @include HcenterVcenter;

                position: relative;
                width: auto;
                height: 25px;
                padding: 0px 5px;
                background: rgba(197, 99, 156, 1);
                color: whitesmoke;
                font-size: 12px;
                font-weight: bold;
                border-radius: 6px;
                box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
                user-select: none;

                &.scored {
                    background: rgba(0, 204, 153, 1);
                }
            }

            .score-title {
                @include HcenterVcenter;

                position: relative;
                width: 80px;
                height: 25px;
                background: rgba(197, 99, 156, 1);
                color: whitesmoke;
                font-size: 12px;
                font-weight: bold;
                border-radius: 6px;
                box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
                user-select: none;
            }

            .msg-power-editor {
                width: 100%;
                height: auto;
                margin: 5px 0px;
                font-size: 16px;
                line-height: 2;
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
