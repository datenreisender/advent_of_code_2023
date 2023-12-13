/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const prediction = (line: string) => {
  let sum = 0

  const current = line.split(' ').map(Number)
  while (current.some(x => x !== 0)) {
    for (let i = 0; i < current.length - 1; i++) {
      current[i] = current[i + 1] - current[i]
    }
    sum += current.pop()
  }

  return sum
}

const part1 = (input?: string) => sum(inputContentLines(input).map(prediction))

const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(114)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
