const state = {
  product: {}
}

const getters = {
  product: (state) => {
    return state.product
  }
}

const mutations = {
  SET_PRODUCT: (state, data) => {
    let { name, id } = data;
    state.product = { name, id }
  }
}

const actions = {
  SetProduct({ commit }, data) {
    commit('SET_PRODUCT', data)
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
