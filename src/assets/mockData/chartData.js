export default [
  {
    name: 'Test',
    root: true,
    children: [
      {
        name: 'right-1',
        level: 1,
        children: [
          {
            name: 'right-1-1',
            level: 2,
            children: [
              { name: 'right-1-1-1', total: 1 },
              { name: 'right-1-1-2', total: 2 },
              { name: 'right-1-1-3', total: 3 },
              { name: 'right-1-4-1', total: 1 }
            ]
          },
          {
            name: 'right-1-2',
            level: 1,
            children: [
              { name: 'right-1-1-1', total: 1 }
            ]
          },
          { name: 'right-1-3', level: 2 },
          {
            name: 'right-1-4',
            level: 2,
            children: [
              { name: 'right-1-4-1', total: 1 },
              { name: 'right-1-4-2', total: 2 },
              { name: 'right-1-4-3', total: 3 },
            ]
          },
          { name: 'right-1-5', level: 2 }
        ]
      },
      {
        name: 'right-2',
        level: 1
      },
    ]
  },
  {
    name: 'Test',
    root: true,
    children: [
      {
        name: 'left-1',
        level: 1,
        children: [
          {
            name: 'left-1-1', level: 2,
            children: [
              { name: 'left-1-3-2', total: 2 }
            ]
          },
          {
            name: 'left-1-2', level: 2,
            children: [
              { name: 'left-1-2-1', total: 1 },
              { name: 'left-1-2-2', total: 2 },
              { name: 'left-1-2-3', total: 3 },
              { name: 'left-1-2-4', total: 4 },
            ]
          },
          {
            name: 'left-1-3', level: 2,
            children: [
              { name: 'left-1-3-1', total: 1 },
              { name: 'left-1-3-2', total: 2 },
              { name: 'left-1-3-3', total: 3 },
              { name: 'left-1-3-4', total: 4 },
              { name: 'left-1-3-5', total: 5 },
            ]
          },
          {
            name: 'left-1-4', level: 2,
            children: [
              { name: 'left-1-3-1', total: 1 }
            ]
          },
          {
            name: 'left-1-5', level: 2,
            children: [
              { name: 'left-1-3-2', total: 1 }
            ]
          },
        ]
      },
      {
        name: 'left-2',
        level: 1
      }
    ]
  }]
