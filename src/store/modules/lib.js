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
  ],
  degree: [
    {
      label: '高',
      value: 1
    },
    {
      label: '较高',
      value: 2
    },
    {
      label: '较低',
      value: 3
    },
    {
      label: '低',
      value: 4
    }
  ]
}

const getters = {
  standardOptions: (state) => {
    return state.standardOptions
  },
  menuTag: (state) => {
    return state.menuTag
  },
  degree: (state) => {
    return state.degree
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
