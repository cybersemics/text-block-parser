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
  const root = { children: [] }
  // Stack of ancestors. The virtual root has depth -1 so every line is nested
  // within it. Each entry tracks the node and the indentation depth of its scope.
  const stack = [{ node: root, depth: -1 }]

  for (let i = 0; i < list.length; i++) {
    const scope = list[i]
    const depth = getDepth(scope)

    // Pop until the top of the stack is a strict ancestor (shallower depth).
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].node
    const node = { scope, children: [] }
    // Cap the number of children per parent at maxNodes. Excess siblings (and
    // their descendants, which attach to the dropped node) are omitted from the
    // result while still tracked on the stack for correct depth resolution.
    if (parent.children.length < maxNodes) {
      parent.children.push(node)
    }
    stack.push({ node, depth })
  }

  return root.children
}

export const parse = (text, maxNodes) => {
  return collapse(text.split('\n').filter(x => x), maxNodes)
}
