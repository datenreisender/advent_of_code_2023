/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, trim, memoizeWith } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const hashRecursive = (s: string) =>
  s.length === 0
    ? 0
    : ((hash(s.slice(0, -1)) + s.charCodeAt(s.length - 1)) * 17) % 256

const hash = (s: string) => {
  let result = 0

  for (let i = 0; i < s.length; i++) {
    result = ((result + s.charCodeAt(i)) * 17) % 256
  }

  return result
}

const part1 = (input = inputContent()) =>
  pipe(trim, split(','), map(hash), sum)(input)

const testInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

test('acceptance of part 1', () => {
  expect(hash('HASH')).toEqual(52)
  expect(part1(testInput)).toEqual(1320)
})

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())

  // console.log('Part 2: ' + part2())
}
