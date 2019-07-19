<template>
    <div>
        <div class="page-title">
            <h3>{{ 'HistoryTitle' | localize }}</h3>
        </div>

        <div class="history-chart">
            <canvas ref="canvas"></canvas>
        </div>

        <Loader v-if="loading"/>

        <p v-else-if="!records.length" class="center">{{ 'HistoryMessage' | localize }}. <router-link to='/record'>{{ 'HistoryMessageLink' | localize }}</router-link></p>

        <section v-else>
            <HistoryTable :records="items"/>

            <Paginate
                v-model="page"
                :page-count="pageCount"
                :click-handler="pageChangeHandler"
                :prev-text="'&#171;'"
                :next-text="'&#187;'"
                :container-class="'pagination center'"
                :page-class="'waves-effect'"
            />
        </section>
    </div>
</template>


<script>

import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable'
import {Pie} from 'vue-chartjs'
import LocalizeFilter from '@/filters/localize.filter'

export default {
    name: 'history',
    extends: Pie,
    mixins: [paginationMixin],
    components: {
        HistoryTable
    },
    data: () => ({
        loading: true,
        records: []
    }),
    async mounted() {
        this.records = await this.$store.dispatch('fetchRecords')
        const categories = await this.$store.dispatch('fetchCategories')

        this.setup(categories)

        this.loading = false
    },
    methods: {
        setup(categories) {
            this.setupPagination(this.records.map(record => {
                return {
                    ...record,
                    categoryName: categories.find(c => c.id === record.categoryId).title,
                    typeClass: record.type === 'income' ? 'green' : 'red',
                    typeText: 
                        record.type === 'income' ? LocalizeFilter('Income') : LocalizeFilter('Outcome')
                }
            }))

            this.renderChart(
                {
                    labels: categories.map(category => category.title),
                    datasets: [{
                        label: 'Расходы по категориям',
                        data: categories.map(category => {
                            return this.records.reduce((total, r) => {
                                if (r.categoryId === category.id && r.type === 'outcome') {
                                    total += +r.amount
                                }
                                return total
                            }, 0)
                        }),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                })
        }
    }
}
</script>
