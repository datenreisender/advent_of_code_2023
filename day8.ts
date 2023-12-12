/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const parseLocation = (s: string) => {
  const [, from, L, R] = s.match(/(\w+) = \((\w+), (\w+)/)

  return [from, { L, R }]
}

const part1 = (input?: string) => {
  const [turns, ...locationSpecs] = inputContentLines(input)

  const locationMap = Object.fromEntries(locationSpecs.map(parseLocation))

  let steps = 0
  let here = 'AAA'

  do {
    here = locationMap[here][turns[steps % turns.length]]
    steps++
  } while (here != 'ZZZ')

  return steps
}

const testInput1 = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`

const testInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`

test('acceptance of part 1', () => {
  expect(part1(testInput1)).toEqual(2)
  expect(part1(testInput2)).toEqual(6)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2(input))
}
