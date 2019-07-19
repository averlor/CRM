<template>
    <div>
        <div class="page-title">
            <h3>{{ 'ProfileTitle' | localize }}</h3>
        </div>

        <form class="form" @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model="name"
                    :class="{invalid: $v.name.$dirty && !$v.name.required}"
                >
                <label for="description">{{ 'ProfileName' | localize }}</label>
                <small 
                    class="helper-text invalid"
                    v-if=" ($v.name.$dirty && !$v.name.required)"
                >{{ 'ProfileMessage_enterName' | localize }}</small>
            </div>

            <div class="switch">
                <label>
                    ENG
                    <input type="checkbox" v-model="isRuLocale">
                    <span class="lever"></span>
                    РУ
                </label>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{ 'ProfileBtnUpdate' | localize }}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<style scoped>
    .switch{
        margin-bottom: 2rem;
    }
</style>

<script>

import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
    data: () => {
        return {
            name: '',
            isRuLocale: true
        }
    },
    validations: {
        name: { required }
    },
    mounted() {
        this.name =  this.info.name
        this.isRuLocale = this.info.locale === 'ru-RU'
        setTimeout(() => {
            M.updateTextFields()
        }, 0)
    },
    computed: {
        ...mapGetters(['info'])
    },
    methods: {
        ...mapActions(['updateInfo']),
        async submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return 
            }

            try {
                await this.updateInfo({
                    name: this.name,
                    locale: this.isRuLocale ? 'ru-RU' : 'en-US'
                })
                this.$message('Данные обновлены')
            }
           catch(e) {}

        }
    }
}
</script>


