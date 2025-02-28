<template>
    <div class="usage-block">
        <div class="time-block">
            <fv-button
                class="switch-btn"
                background="transparent"
                :border-radius="50"
                @click="prev"
            >
                <i class="ms-Icon ms-Icon--ChevronLeft"></i>
            </fv-button>
            <p class="current-month">{{currentMonthName}}</p>
            <fv-button
                class="switch-btn"
                background="transparent"
                :border-radius="50"
                :disabled="new Date().getMonth() === currentMonth"
                @click="next"
            >
                <i class="ms-Icon ms-Icon--ChevronRight"></i>
            </fv-button>
            <p class="current-year">{{currentYear}}</p>
        </div>
        <div class="chart-container">
            <number-bar :value="formatCostList"></number-bar>
        </div>
    </div>
</template>

<script>
import numberBar from './numberBar.vue';

export default {
    components: {
        numberBar
    },
    data() {
        return {
            searchDate: {
                year: new Date().getFullYear(),
                month: new Date().getMonth()
            },
            costList: [],
            formatCostList: []
        };
    },
    watch: {
        searchDate: {
            handler() {
                this.getRangeCost();
            },
            deep: true
        },
        costList() {
            this.computeFormatCostList();
        }
    },
    computed: {
        currentYear() {
            return this.searchDate.year;
        },
        currentMonth() {
            return this.searchDate.month;
        },
        currentMonthName() {
            return new Date(this.currentYear, this.currentMonth).toLocaleString(
                'default',
                { month: 'long' }
            );
        },
        from() {
            return new Date(
                this.currentYear,
                this.currentMonth,
                1,
                0,
                0,
                0,
                0
            ).toISOString();
        },
        to() {
            return new Date(
                this.currentYear,
                this.currentMonth + 1,
                0,
                0,
                0,
                0,
                0
            ).toISOString();
        }
    },
    mounted() {
        this.getRangeCost();
    },
    methods: {
        prev() {
            let sourceDate = new Date(
                this.searchDate.year,
                this.searchDate.month
            );
            sourceDate.setMonth(sourceDate.getMonth() - 1);
            this.searchDate.year = sourceDate.getFullYear();
            this.searchDate.month = sourceDate.getMonth();
        },
        next() {
            let sourceDate = new Date(
                this.searchDate.year,
                this.searchDate.month
            );
            sourceDate.setMonth(sourceDate.getMonth() + 1);
            this.searchDate.year = sourceDate.getFullYear();
            this.searchDate.month = sourceDate.getMonth();
        },
        getRangeCost() {
            this.$api.ModelController.getMessageCostList(this.from, this.to)
                .then((res) => {
                    if (res.data) {
                        res.data.sort((a, b) => {
                            return a.createdAt - b.createdAt;
                        });
                        this.costList = res.data;
                    }
                })
                .catch((res) => {
                    if (res.message)
                        this.$barWarning(res.message, {
                            status: 'error'
                        });
                });
        },
        computeFormatCostList() {
            let formatCostList = [];
            if (this.costList.length > 0) {
                let placeholder = {
                    date: new Date(this.costList[0].createdAt * 1000),
                    monthStr: new Date(
                        this.costList[0].createdAt * 1000
                    ).toLocaleString('default', { month: 'long' }),
                    cost: 0
                };
                this.costList.forEach((e) => {
                    let createdAt = new Date(e.createdAt * 1000);
                    if (createdAt.getDate() !== placeholder.date.getDate()) {
                        formatCostList.push(Object.assign({}, placeholder));
                        placeholder = {
                            date: createdAt,
                            monthStr: createdAt.toLocaleString('default', {
                                month: 'long'
                            }),
                            cost: 0
                        };
                    }
                    placeholder.cost += e.cost;
                });

                formatCostList.push(Object.assign({}, placeholder));
                formatCostList.forEach((e) => {
                    e.value = (e.cost / 1e6).toFixed(3);
                    e.name = e.monthStr + ' ' + e.date.getDate();
                });
            }
            this.formatCostList = formatCostList;
        }
    }
};
</script>

<style lang="scss">
.usage-block {
    position: relative;
    width: 100%;
    height: 300px;

    .time-block {
        @include Vcenter;

        .switch-btn {
            width: 30px;
            height: 30px;
        }

        .current-month {
            margin: 0 20px;
            font-weight: bold;
        }

        .current-year
        {
            margin: 0 20px;
            font-size: 12px;
            color: rgba(90, 90, 90, 1);
        }
    }
}
</style>