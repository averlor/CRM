<template>
    <ul class="sidenav app-sidenav" :class="{open : value}">

        <router-link
            v-for="link in links"
            :key="link.url"
            tag="li"
            active-class="active"
            :to='link.url'
            :exact="link.exact"
        >
            <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
        </router-link>
    </ul>
</template>


<script>

import LocalizeFilter from '@/filters/localize.filter'

export default {
    props: ['value'],
    data: () => ({
        links: [
            {title: LocalizeFilter('Menu_Bill'), url: '/', exact:true},
            {title: LocalizeFilter('Menu_History'), url: '/history'},
            {title: LocalizeFilter('Menu_Planning'), url: '/planning'},
            {title: LocalizeFilter('Menu_New_Record'), url: '/record'},
            {title: LocalizeFilter('Menu_Categories'), url: '/categories'}
        ]
    })
}
</script>
