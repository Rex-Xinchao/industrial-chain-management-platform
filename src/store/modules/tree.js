const state = {
  treeMap: {}
}

const getters = {
  treeMap: (state) => {
    return state.treeMap
  }
}

const mutations = {
  SET_TREE: (state, data) => {
    state.treeMap[data.id] = data.nodes
  }
}

const actions = {
  SetTree({ commit }, data) {
    commit('SET_TREE', data)
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
