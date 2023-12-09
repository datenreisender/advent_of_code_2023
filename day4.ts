/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, intersection, count } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const winCount = (card: string) => {
  const [, winningNumbersSpec, ownNumbersSpec] = card.match(
    /Card +\d+: +(.*?) \| +(.*)/
  )

  const winningNumbers = winningNumbersSpec.split(/ +/).map(Number)
  const ownNumbers = ownNumbersSpec.split(/ +/).map(Number)

  return intersection(winningNumbers, ownNumbers).length
}

const cardValue = (card: string) =>
  winCount(card) === 0 ? 0 : 2 ** (winCount(card) - 1)

const part1 = (cards: string[]) => sum(cards.map(cardValue))

const testInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`

test('acceptance of part 1', () => {
  expect(part1(inputContentLines(testInput))).toEqual(13)
})

const part2 = (cards: string[]) => {
  const copies = new Array(cards.length).fill(1)

  cards.forEach((card, index) => {
    for (let i = winCount(card); i > 0; i--) {
      copies[index + i] += copies[index]
    }
  })

  return sum(copies)
}

test('acceptance of part 2', () => {
  expect(part2(inputContentLines(testInput))).toEqual(30)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContentLines()
  console.log('Part 1: ' + part1(input))
  console.log('Part 2: ' + part2(input))
}
