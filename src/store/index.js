import Vue from 'vue'
import Vuex from 'vuex'
import lib from './modules/lib'
import user from './modules/user'
import product from './modules/product'
import tree from './modules/tree'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { lib, user, product, tree }
})
