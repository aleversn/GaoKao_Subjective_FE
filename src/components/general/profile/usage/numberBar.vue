<template>
    <canvas ref="chart" />
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);
export default {
    props: {
        value: {
            default: () => [
                {
                    name: '福州市',
                    value: 0
                }
            ]
        }
    },
    data() {
        return {
            chart: null
        };
    },
    watch: {
        value() {
            this.refresh();
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {
        this.init();
        this.refresh();
    },
    methods: {
        init() {
            let { width } = this.$el.parentElement.getBoundingClientRect();
            let ctx = this.$refs.chart;
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['***'],
                    datasets: [
                        {
                            label: this.local('Usage'),
                            data: [0],
                            backgroundColor: this.color
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                // 自定义 tooltip 显示的内容
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || '';
                                    return `${this.local('Usage')} ￥${value}${this.local('CNY')}`;
                                },
                                labelTextColor: () => {
                                    return 'rgba(36, 36, 36, 1)';
                                },
                            },
                            // 设置 tooltip 样式
                            backgroundColor: 'rgba(250, 250, 250, 1)',
                            borderColor: 'rgba(220, 220, 220, 0.3)',
                            borderWidth: 1,
                            titleColor: 'rgba(36, 36, 36, 1)',
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
            this.chart.resize(width, width);
        },
        refresh() {
            let value = this.value;
            this.chart.data.datasets[0].data = value.map((e) => e.value);
            this.chart.data.labels = value.map((e) => e.name);
            this.chart.update();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>