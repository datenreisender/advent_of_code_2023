/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, groupWith } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

enum Type {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIRS,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND
}

const detectTypeWithJokers = (groupedCards: string[][]) => {
  const jokerCount = (groupedCards.filter(cards => cards[0] === 'J')[0] ?? [])
    .length
  const withoutJokers = groupedCards.filter(cards => cards[0] !== 'J')
  const twoPairs =
    withoutJokers.filter(cards => cards.length === 2).length === 2

  switch (true) {
    case jokerCount === 5 ||
      withoutJokers.some(cards => cards.length === 5 - jokerCount):
      return Type.FIVE_OF_A_KIND
    case withoutJokers.some(cards => cards.length === 4 - jokerCount):
      return Type.FOUR_OF_A_KIND
    case (withoutJokers.some(cards => cards.length === 3) &&
      withoutJokers.some(cards => cards.length === 2)) ||
      (jokerCount === 1 && twoPairs):
      return Type.FULL_HOUSE
    case withoutJokers.some(cards => cards.length === 3 - jokerCount):
      return Type.THREE_OF_A_KIND
    case twoPairs:
      return Type.TWO_PAIRS
    case withoutJokers.some(cards => cards.length === 2 - jokerCount):
      return Type.ONE_PAIR
    default:
      return Type.HIGH_CARD
  }
}

const detectType = (groupedCards: string[][]) => {
  switch (true) {
    case groupedCards.some(cards => cards.length === 5):
      return Type.FIVE_OF_A_KIND
    case groupedCards.some(cards => cards.length === 4):
      return Type.FOUR_OF_A_KIND
    case groupedCards.some(cards => cards.length === 3) &&
      groupedCards.some(cards => cards.length === 2):
      return Type.FULL_HOUSE
    case groupedCards.some(cards => cards.length === 3):
      return Type.THREE_OF_A_KIND
    case groupedCards.filter(cards => cards.length === 2).length === 2:
      return Type.TWO_PAIRS
    case groupedCards.some(cards => cards.length === 2):
      return Type.ONE_PAIR
    default:
      return Type.HIGH_CARD
  }
}

type CategorisedHand = ReturnType<ReturnType<typeof categorise>>
const categorise = (withJokers: boolean) => (line: string) => {
  const [hand, bid] = line.split(' ')
  const groupedCards = groupWith<string>(equals, hand.split('').sort())

  return {
    type: withJokers
      ? detectTypeWithJokers(groupedCards)
      : detectType(groupedCards),
    hand,
    bid: Number(bid)
  }
}

const valueOf = (card: string, withJokers: boolean) => {
  switch (card) {
    case 'A':
      return 14
    case 'K':
      return 13
    case 'Q':
      return 12
    case 'J':
      return withJokers ? 1 : 11
    case 'T':
      return 10
    default:
      return Number(card)
  }
}

const byCards = (handA: string, handB: string, withJokers: boolean) => {
  const [a, b] = zip(handA.split(''), handB.split('')).find(([a, b]) => a !== b)
  return valueOf(a, withJokers) - valueOf(b, withJokers)
}

const byValue =
  (withJokers: boolean) => (a: CategorisedHand, b: CategorisedHand) =>
    a.type !== b.type ? a.type - b.type : byCards(a.hand, b.hand, withJokers)

const toAmount = (hand: CategorisedHand, index: number) =>
  hand.bid * (index + 1)

const compute = (input: string[], withJokers = false) =>
  sum(input.map(categorise(withJokers)).sort(byValue(withJokers)).map(toAmount))

const part1 = (input: string[]) => compute(input)
const part2 = (input: string[]) => compute(input, true)

const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`

test('acceptance of part 1', () => {
  expect(part1(inputContentLines(testInput))).toEqual(6440)
})

test('acceptance of part 2', () => {
  expect(part2(inputContentLines(testInput))).toEqual(5905)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContentLines()
  console.log('Part 1: ' + part1(input))
  console.log('Part 2: ' + part2(input))
}
