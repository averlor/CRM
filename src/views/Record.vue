<template>
    <div>
        <div class="page-title">
            <h3>{{ 'RecordTitle' | localize }}</h3>
        </div>

        <Loader v-if="loading" />

        <p class="center" v-else-if="!categories.length">{{ 'RecordMessage' | localize }} <router-link to="/categories">{{ 'RecordMessageLink' | localize }}</router-link></p>

        <form v-else class="form" @submit.prevent="submitHandler">
            <div class="input-field" >
                <select ref="select" v-model="category">
                    <option
                        v-for="c of categories"
                        :key="c.id"
                        :value="c.id"
                    >{{ c.title }}</option>
                </select>
                <label>{{ 'RecordSubTitle' | localize }}</label>
            </div>

            <p>
                <label>
                <input
                    class="with-gap"
                    name="type"
                    type="radio"
                    value="income"
                    v-model="type"
                />
                <span>{{ 'RecordTitleIncome' | localize }}</span>
                </label>
            </p>

            <p>
                <label>
                <input
                    class="with-gap"
                    name="type"
                    type="radio"
                    value="outcome"
                    v-model="type"
                />
                <span>{{ 'RecordTitleOutcome' | localize }}</span>
                </label>
            </p>

            <div class="input-field">
                <input
                    id="amount"
                    type="number"
                    v-model.number="amount"
                    :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
                >
                <label for="amount">{{ 'RecordSubTitleSumm' | localize }}</label>
                <span 
                    v-if="$v.amount.$dirty && !$v.amount.minValue" 
                    class="helper-text invalid"
                >{{ 'RecordMessageWarning' | localize }} {{ $v.amount.$params.minValue.min }}</span>
            </div>

            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model.trim="description"
                    :class="{invalid: $v.description.$dirty && !$v.description.required}"
                >
                <label for="description">{{ 'RecordSubTitleDescription' | localize }}</label>
                <span
                    v-if="$v.description.$dirty && !$v.description.required"
                    class="helper-text invalid"
                >Поле не должно быть пустым</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{ 'RecordTitleBtnCreate' | localize }}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>


<script>

import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

export default {
    name: 'record',
    metaInfo() {
        return {
            title: this.$title('New Record')
            }
    },
    data: () => ({
        loading: true,
        select: null,
        categories: [],
        category: null,
        type: 'outcome',
        amount: 1,
        description: ''
    }),
    validations: {
        amount: {minValue: minValue(100)},
        description: {required}
    },
    computed: {
        ...mapGetters(['info']),
        canCreateRecord() {
            if (this.type === 'income') {
                return true
            }

            return this.info.bill >= this.amount
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories')
        this.loading = false

        if (this.categories.length) {
            this.category = this.categories[0].id
        }

        setTimeout(() => {
            this.select = M.FormSelect.init(this.$refs.select)
            M.updateTextFields()
        }, 0)
    },
    beforeDestroy() {
        if (this.select && this.select.destroy) {
            this.select.destroy()
        }
    },
    methods: {
        async submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }

            if (this.canCreateRecord) {
                try{
                    await this.$store.dispatch('createRecord', {
                    categoryId: this.category,
                    amount: this.amount,
                    description: this.description,
                    type: this.type,
                    date: new Date().toJSON()
                })

                const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount

                await this.$store.dispatch('updateInfo', {bill})
                this.$message('Запись успешно создана')
                this.$v.$reset()
                this.amount = 1
                this.description = ''
                } catch(e) {console.log(e)}
                
            } else {
                this.$message(`У вас недостаточно средств на счете (${this.amount - this.info.bill})`)
            }

            // try{
                
            // }
            // catch(e) {console.log(e)}
        }
    }
}
</script>