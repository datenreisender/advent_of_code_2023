/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, product } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const waysToWin = (time: number, distance: number) => {
  const fixed = time / 2
  const diff = Math.sqrt((time * time) / 4 - distance)

  const lower = fixed - diff
  const upper = fixed + diff

  if (lower === upper) return 0

  const adjustment = lower === Math.round(lower) ? 0.1 : 0

  const realLower = Math.ceil(lower + adjustment)
  const realUpper = Math.ceil(upper - adjustment)

  return Math.ceil(upper - adjustment) - Math.ceil(lower + adjustment)
}

const part1 = (input: string) => {
  const times = input
    .match(/Time:\s+([\d ]+)/)[1]
    .split(/\s+/)
    .map(Number)
  const distances = input
    .match(/Distance:\s+([\d ]+)/)[1]
    .split(/\s+/)
    .map(Number)

  return product(
    zip(times, distances).map(([time, distance]) => waysToWin(time, distance))
  )
}

const part2 = (input: string) => {
  const time = Number(input.match(/Time:\s+([\d ]+)/)[1].replaceAll(' ', ''))

  const distance = Number(
    input.match(/Distance:\s+([\d ]+)/)[1].replaceAll(' ', '')
  )

  return waysToWin(time, distance)
}

const testInput = `
Time:      7  15   30
Distance:  9  40  200
`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(288)
})

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(71503)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContent()

  console.log('Part 1: ' + part1(input))
  console.log('Part 2: ' + part2(input))
}
