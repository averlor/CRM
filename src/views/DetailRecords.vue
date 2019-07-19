<template>
    <div>

        <Loader v-if="loading" />

        <div v-else-if="record">
            <div class="breadcrumb-wrap">
                <router-link to="/history" class="breadcrumb">{{ 'DetailTitle' | lacolize }}</router-link>
                <a @click.prevent class="breadcrumb">
                {{record.type === 'income' ? 'Income' : 'Outcome' | localize }}
                </a>
            </div>
            <div class="row">
                <div class="col s12 m6">
                    <div
                        :class="{
                            'green' : record.type === 'income',
                            'red' : record.type === 'outcome'
                            }" 
                        class="card"
                    >
                        <div class="card-content white-text">
                            <p>{{ 'DetailDescription' | localize }}: {{ record.description }}</p>
                            <p>{{ 'DetailSumm' | localize }}: {{ record.amount | currency }}</p>
                            <p>{{ 'DetailCategory' | localize }}: {{ record.categoryName }}</p>

                            <small>{{ record.date | date('datetime') }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p class="center" v-else>Записи с id=<strong>{{ this.$route.params.id }}</strong> не найдена</p>
    </div>
</template>

<script>
export default {
    name: 'detail',
    data: () => ({
        record: null,
        loading: true
    }),
    async mounted() {
        const id = this.$route.params.id
        const record = await this.$store.dispatch('fetchRecordByid', id)
        const category = await this.$store.dispatch('fetchCategoryByid', record.categoryId)

        this.record = {
            ...record,
            categoryName: category.title
        }
        
        this.loading = false
    }
}
</script>
