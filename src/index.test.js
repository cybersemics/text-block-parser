import * as mod from '.'

// const log = (x) =>
//   console.log(JSON.stringify(x, null, '  '))

describe('isWithinScope', () => {
  it('should is', () => {
    expect(mod.isWithinScope('x', ' y')).toBe(true)
    expect(mod.isWithinScope(' x', '  y')).toBe(true)
  })

  it('should is not', () => {
    expect(mod.isWithinScope('x', 'y')).toBe(false)
    expect(mod.isWithinScope(' x', 'y')).toBe(false)
    expect(mod.isWithinScope(' x', ' y')).toBe(false)
  })
})

describe('findNextEquivalentScope', () => {
  it('nothing', () => {
    const scope = undefined
    const list = []
    const result = mod.findNextEquivalentScope(scope, list)
    expect(result).toBe()
  })

  it('no others', () => {
    const scope = 'x'
    const list = []
    const result = mod.findNextEquivalentScope(scope, list)
    expect(result).toBe()
  })

  it('only children', () => {
    const scope = 'x'
    const list = [' x']
    const result = mod.findNextEquivalentScope(scope, list)
    expect(result).toBe()
  })

  it('sibling', () => {
    const scope = 'x'
    const list = ['x']
    const result = mod.findNextEquivalentScope(scope, list)
    expect(result).toBe(1)
  })

  it('parent', () => {
    const scope = ' x'
    const list = ['x']
    const result = mod.findNextEquivalentScope(scope, list)
    expect(result).toBe(1)
  })
})

describe('findLinesWithinScope', () => {
  it('bullcrap', () => {
    const scope = undefined
    const lines = []
    const result = mod.findLinesWithinScope(scope, lines)
    expect(result).toEqual([])
  })

  it('no lines', () => {
    const scope = 'x'
    const lines = []
    const result = mod.findLinesWithinScope(scope, lines)
    expect(result).toEqual([])
  })

  it('sibling', () => {
    const scope = 'x'
    const lines = ['y']
    const result = mod.findLinesWithinScope(scope, lines)
    expect(result).toEqual([])
  })

  it('parent', () => {
    const scope = ' x'
    const lines = ['y']
    const result = mod.findLinesWithinScope(scope, lines)
    expect(result).toEqual([])
  })

  it('one line', () => {
    const scope = 'x'
    const lines = [' y']
    const result = mod.findLinesWithinScope(scope, lines)
    expect(result).toEqual([' y'])
  })
})

describe('collapse', () => {
  it('empty list', () => {
    const list = []
    const result = mod.collapse(list)
    expect(result).toEqual([])
  })

  it('single', () => {
    const list = ['x']
    const result = mod.collapse(list)
    expect(result).toEqual([
      {
        scope: 'x',
        children: [],
      },
    ])
  })

  it('two', () => {
    const list = ['x', 'y']
    const result = mod.collapse(list)
    expect(result).toEqual([
      {
        scope: 'x',
        children: [],
      },
      {
        scope: 'y',
        children: [],
      },
    ])
  })

  it('three', () => {
    const list = ['x', 'y', 'z']
    const result = mod.collapse(list)
    expect(result).toEqual([
      {
        scope: 'x',
        children: [],
      },
      {
        scope: 'y',
        children: [],
      },
      {
        scope: 'z',
        children: [],
      },
    ])
  })

  it('nested', () => {
    const list = ['x', ' x', 'y']
    const result = mod.collapse(list)
    expect(result).toEqual([
      {
        scope: 'x',
        children: [
          {
            scope: ' x',
            children: [],
          },
        ],
      },
      {
        scope: 'y',
        children: [],
      },
    ])
  })
})

describe('maxNodes', () => {
  const input = `
- a
  - b
    - 1
    - 2
    - 3
    - 4
    - 5
- c
  - d
    - e`

  const result = mod.parse(input, 3)
  expect(result).toEqual(
    [
      {
        'scope': '- a',
        'children': [
          {
            'scope': '  - b',
            'children': [
              {
                'scope': '    - 1',
                'children': []
              },
              {
                'scope': '    - 2',
                'children': []
              },
              {
                'scope': '    - 3',
                'children': []
              },
            ]
          }
        ]
      },
      {
        'scope': '- c',
        'children': [
          {
            'scope': '  - d',
            'children': [
              {
                'scope': '    - e',
                'children': []
              }
            ]
          }
        ]
      }
    ]
  )
})

describe('mac daddy', () => {
  it('should blow away all expectations for awesomeness at every tier', () => {
    const input = `
boo
  boo-horse
  boo-cat
  boo-dog

bee
  bee-yellow
    bee-yellow-one

    bee-yellow-two

baa

blork
                apple



                orange
                  smorange
        cat

`

    const result = mod.parse(input)
    // log(result)
    expect(result).toEqual(
      [
        {
          'scope': 'boo',
          'children': [
            {
              'scope': '  boo-horse',
              'children': []
            },
            {
              'scope': '  boo-cat',
              'children': []
            },
            {
              'scope': '  boo-dog',
              'children': []
            }
          ]
        },
        {
          'scope': 'bee',
          'children': [
            {
              'scope': '  bee-yellow',
              'children': [
                {
                  'scope': '    bee-yellow-one',
                  'children': []
                },
                {
                  'scope': '    bee-yellow-two',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'scope': 'baa',
          'children': []
        },
        {
          'scope': 'blork',
          'children': [
            {
              'scope': '                apple',
              'children': []
            },
            {
              'scope': '                orange',
              'children': [
                {
                  'scope': '                  smorange',
                  'children': []
                }
              ]
            },
            {
              'scope': '        cat',
              'children': []
            }
          ]
        }
      ]
    )
  })
})
