# text-block-parser

[![npm version](https://img.shields.io/npm/v/text-block-parser)](https://www.npmjs.com/package/text-block-parser)

**Parse blocks of text based on indentation.**

This is a fork of https://github.com/reergymerej/block-parser that adds:

- types
- maxNodes option

## Install

```
npm install text-block-parser
```

## Usage

```js
const { parse } = require('text-block-parser')

const input = `
hello
world
`

parse(input)

[ { scope: 'hello', children: [] },
  { scope: 'world', children: [] } ]
```

The maximum number of children is 100 by default. Additional children will be dropped. To allow more children, you can specify `maxNodes` in the second argument:

```
parse(input, Infinity)
```

### Deep

We don't care about blank lines or the [type of
indentation](https://softwareengineering.stackexchange.com/questions/57/tabs-versus-spaces-what-is-the-proper-indentation-character-for-everything-in-e).
```js
input = `
fruits
  apple
    gala
    pink lady
  pear

  cherry
    white

veggies
  kale
    red russian

  cabbage
  radish
`

parse(input)

[ { scope: 'fruits',
    children:
     [ { scope: '  apple',
         children:
          [ { scope: '    gala', children: [] },
            { scope: '    pink lady', children: [] } ] },
       { scope: '  pear', children: [] },
       { scope: '  cherry',
         children: [ { scope: '    white', children: [] } ] } ] },
  { scope: 'veggies',
    children:
     [ { scope: '  kale',
         children: [ { scope: '    red russian', children: [] } ] },
       { scope: '  cabbage', children: [] },
       { scope: '  radish', children: [] } ] } ]
```
