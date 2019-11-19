const state = {
  standardOptions: [
    {
      label: '数库',
      value: 1
    },
    {
      label: '申万',
      value: 2
    },
    {
      label: '国标',
      value: 3
    }
  ],
  menuTag: [
    {
      name: '首页',
      to: 'index'
    },
    {
      name: '产品分类维护',
      to: 'maintain'
    },
    {
      name: '上下游数据同步',
      to: 'sync'
    },
    {
      name: '管理用户',
      to: 'manage'
    }
  ]
}

const getters = {
  standardOptions: (state) => {
    return state.standardOptions
  },
  menuTag: (state) => {
    return state.menuTag
  }
}

const mutations = {
}

const actions = {
}

export default {
  state,
  mutations,
  getters,
  actions
}
