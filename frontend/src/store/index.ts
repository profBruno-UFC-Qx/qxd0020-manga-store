import { createStore } from 'vuex'
import Axios from 'axios'

const state = {
    mangas: [],
    manga: null
}

const getters = {
    numberOfMangas(state){
        return state.mangas.length
    }
}

const mutations = {
    setMangas(state, mangas) {
        state.mangas = mangas
    },
    setManga(state, manga) {
        state.manga = manga
    }
}

const actions = {
    async getMangas({ commit }) {
        try {
            const response = await axios.get('/mangas')
            commit('setMangas', response.data)
        } catch(error) {
            console.log(error)
        }
    },
    async getManga({ commit }, id) {
        try {
            const response = await axios.get(`/mangas/${id}`)
            commit('setManga', response.data)
        } catch(error) {
            console.log(error)
        }
    }
}

export const store = createStore({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
})

export const axios = Axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
    headers: {
        Accept: "application/json",
        "Content-type": "application/json"
    }
})