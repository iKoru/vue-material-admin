/* global localStorage */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: null
  },
  getters: {
    accessToken (state) {
        return state.accessToken;
    }
  },
  mutations: {
    SIGNIN (state, {accessToken}) {
      state.accessToken = accessToken
    },
    SIGNOUT (state) {
      state.accessToken = null
    }
  },
  actions: {
    signin ({commit}, {accessToken}) {
      commit('SIGNIN', {accessToken});
    },
    signout ({commit}) {
      localStorage.removeItem('accessToken');
      axios.defaults.headers.common['x-auth'] = null;
      commit('SIGNOUT');
    },
  }
})