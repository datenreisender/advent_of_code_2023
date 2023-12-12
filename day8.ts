/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, ip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, startsWith, endsWith, count, product } from 'ramda' // eslint-disable-line no-unused-vars
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

const locationAfterRound = (
  start: string,
  locations: Record<string, { L: string; R: string }>,
  turns: string
) =>
  turns.split('').reduce<string>((here, turn) => locations[here][turn], start)

const part2 = (input?: string) => {
  const [turns, ...locationSpecs] = inputContentLines(input)

  const locationMap = Object.fromEntries(locationSpecs.map(parseLocation))
  const allLocations = Object.keys(locationMap)
  const startLocations = allLocations.filter(endsWith('A'))

  const locationAfterSingleRoundMap = Object.fromEntries(
    allLocations.map((l: string) => [
      l,
      locationAfterRound(l, locationMap, turns)
    ])
  )

  let rounds = 0
  let here = startLocations
  const roundsForLoop = {}

  do {
    here = here.map(h => locationAfterSingleRoundMap[h])
    rounds++
    here.forEach((h, index) => {
      if (h.endsWith('Z')) {
        roundsForLoop[startLocations[index]] = rounds
      }
    })
  } while (startLocations.length !== Object.keys(roundsForLoop).length)

  return product(Object.values(roundsForLoop)) * turns.length
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

const testInput3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11)
11 = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22, 22)
22 = (22B, 22B)
XXX = (XXX, XXX)
`

xtest('acceptance of part 2', () => {
  expect(part2(testInput3)).toEqual(6)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
}
