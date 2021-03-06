import firebase from 'firebase/app'
import { throws } from 'assert';

export default {
    actions: {
        async login({dispatch, commit}, {email,password}) {
            try{
                await firebase.auth().signInWithEmailAndPassword(email, password)
            }
            catch(e){
                commit('SET_ERROR', e)
                throw e
            }
        },
        async logout({commit}) {
            await firebase.auth().signOut()
            commit('CLEAR_INFO')
        },
        async register({dispatch, commit}, {email, password, name, locale}) {
            try{
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    name: name,
                    locale: locale
                })
            }
            catch(e){
                commit('SET_ERROR', e)
                throw e
            }
        },
        getUid() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        }
    }
}