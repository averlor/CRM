<template>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>{{ 'HistoryTableSum' | localize }}</th>
                <th>{{ 'HistoryTableDate' | localize }}</th>
                <th>{{ 'HistoryTableCategories' | localize }}</th>
                <th>{{ 'HistoryTableType' | localize }}</th>
                <th>{{ 'HistoryTableOpen' | localize }}</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(record, idx) in records" :key="record.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ record.amount | currency("RUB") }}</td>
                <td>{{ record.date | date('datetime') }}</td>
                <!-- как локализовать данные из переменной? -->
                <td>{{ record.categoryName }}</td>
                <td>
                    <span 
                        :class="[record.typeClass]"
                        class="white-text badge">{{ record.typeText }}</span>
                </td>
                <td>
                    <button 
                        class="btn-small btn" 
                        @click="$router.push('/detail/' + record.id)"
                        v-tooltip="'Посмотреть запись'"
                    >
                    <i class="material-icons">open_in_new</i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        records: {
            required: true,
            type: Array
        }
    }
}
</script>

