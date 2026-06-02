/** Returns the matched indices in `text` for each char in `query` (in order), or null if no match. */
export function fuzzyMatch(query: string, text: string): number[] | null {
  const lq = query.toLowerCase()
  const lt = text.toLowerCase()
  const indices: number[] = []
  let qi = 0
  for (let ti = 0; ti < lt.length && qi < lq.length; ti++) {
    if (lt[ti] === lq[qi]) {
      indices.push(ti)
      qi++
    }
  }
  return qi === lq.length ? indices : null
}
