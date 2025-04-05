// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    settings: {
      notifications: true,
    },
  },
  mutations: {
    login(state, username) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
    updateSettings(state, settings) {
      state.settings = settings;
    },
  },
  actions: {
    login({ commit }, username) {
      commit("login", username);
    },
    logout({ commit }) {
      commit("logout");
    },
    updateSettings({ commit }, settings) {
      commit("updateSettings", settings);
    },
  },
});
