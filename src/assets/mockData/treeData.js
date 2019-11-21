export default [
  {
    name: "父节点1",
    id: 1,
    rename: true,
    delete: true,
    move: true,
    add: true,
    needMapping: true,
    children: [
      {
        name: "父节点11",
        id: 11,
        children: [
          { name: "叶子节点111", id: 111 },
          { name: "叶子节点112", id: 112 },
          { name: "叶子节点113", id: 113 },
          { name: "叶子节点114", id: 114 },
          { name: "叶子节点115", id: 115 },
          { name: "叶子节点116", id: 116 },
          { name: "叶子节点117", id: 117 },
          { name: "叶子节点118", id: 118 },
          { name: "叶子节点119", id: 119 },
        ]
      },
      {
        name: "父节点12",
        id: 12,
        children: [
          { name: "叶子节点121", id: 121 },
          { name: "叶子节点122", id: 122 },
          { name: "叶子节点123", id: 123 },
          { name: "叶子节点124", id: 124 }
        ]
      },
      { name: "父节点13", id: 13 }
    ]
  },
  {
    name: "父节点2",
    id: 2,
    rename: true,
    delete: false,
    move: false,
    add: false,
    needMapping: false,
    children: [
      {
        name: "父节点21"
        , id: 21,
        rename: false,
        delete: true,
        move: false,
        add: false,
        needMapping: false,
        children: [
          { name: "叶子节点211", id: 211 },
          { name: "叶子节点212", id: 212 },
          { name: "叶子节点213", id: 213 },
          { name: "叶子节点214", id: 214 }
        ]
      },
      {
        name: "父节点22",
        id: 22,
        rename: false,
        delete: false,
        move: false,
        add: true,
        needMapping: false,
        children: [
          {
            name: "叶子节点221", id: 221,
            rename: false,
            delete: false,
            move: false,
            add: true,
            needMapping: false,
          },
          {
            name: "叶子节点222", id: 222,
            rename: false,
            delete: false,
            move: false,
            add: true,
          },
          {
            name: "叶子节点223", id: 223,
            rename: false,
            delete: false,
            move: false,
            add: true,
          },
          {
            name: "叶子节点224", id: 224,
            rename: false,
            delete: false,
            move: false,
            add: true,
          }
        ]
      },
      {
        name: "父节点23", id: 23,
        children: [
          { name: "叶子节点231", id: 231 },
          { name: "叶子节点232", id: 232 },
          { name: "叶子节点233", id: 233 },
          { name: "叶子节点234", id: 234 }
        ]
      }
    ]
  },
  {
    name: "父节点3",
    id: 3,
    rename: false,
    delete: false,
    move: false,
    add: true,
    needMapping: false,
  }

]
