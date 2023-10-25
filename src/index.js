const getDepth = (text) => {
  const whitespace = /^\s*/.exec(text)
  return whitespace
    ? whitespace[0].length
    : 0
}

export const isWithinScope = (scope, value) => {
  const scopeDepth = getDepth(scope)
  const valueDepth = getDepth(value)
  return valueDepth > scopeDepth
}

export const findNextEquivalentScope = (scope, list) => {
  const index = list.findIndex(item => {
    return !isWithinScope(scope, item)
  })
  return index === -1 ? undefined : index + 1
}

export const findLinesWithinScope = (scope, lines) => {
  const indexOfNextScope = findNextEquivalentScope(scope, lines)
  if (indexOfNextScope === undefined) {
    return lines
  } else {
    const withinScope = lines.slice(0, indexOfNextScope - 1)
    return withinScope
  }
}

export const collapse = (list, maxNodes = 100) => {
  if (!list.length) {
    return []
  }

  const result = []

  let i = 0
  let scope
  let tail
  let count = 0

  do {
    scope = list[i]
    tail = list.slice(i + 1)
    const nextScopeIndex = findNextEquivalentScope(scope, tail)
    const children = findLinesWithinScope(scope, tail)
    const collapsedChildren = collapse(children, maxNodes)
    result.push({
      scope,
      children: collapsedChildren,
    })
    if (nextScopeIndex) {
      i += nextScopeIndex
    } else {
      break
    }
  } while (++count < maxNodes)

  return result
}

export const parse = (text, maxNodes) => {
  return collapse(text.split('\n').filter(x => x), maxNodes)
}
