/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, always, negate, not, memoizeWith } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const operationalAtTheBeginning = (
  record: string[],
  numbers: number[],
  unknownDamagedCount: number
) => tryNextArrangement(record.slice(1), numbers, unknownDamagedCount)

const damagedAtTheBeginning = (
  record: string[],
  numbers: number[],
  unknownDamagedCount: number
) => {
  const isPossible =
    record.length >= numbers[0] &&
    record.slice(0, numbers[0]).every(complement(equals('.'))) &&
    record[numbers[0]] != '#'
  if (!isPossible) return 0

  const sliceThatMustBeDamaged = record.slice(0, numbers[0])
  const foundUnknownDamaged = sliceThatMustBeDamaged.filter(equals('?')).length

  return tryNextArrangement(
    record.slice(numbers[0] + 1),
    numbers.slice(1),
    unknownDamagedCount - foundUnknownDamaged
  )
}

const tryNextArrangement = memoizeWith(
  (record: string[], numbers: number[], unknownDamagedCount: number) =>
    record.join('') + numbers.join(',') + '_' + unknownDamagedCount,
  (record: string[], numbers: number[], unknownDamagedCount: number) => {
    if (unknownDamagedCount < 0) return 0
    if (record.length === 0) return numbers.length === 0 ? 1 : 0

    const char = record[0]

    if (char === '.') {
      return operationalAtTheBeginning(record, numbers, unknownDamagedCount)
    }

    if (char === '#') {
      return damagedAtTheBeginning(record, numbers, unknownDamagedCount)
    }

    return (
      operationalAtTheBeginning(record, numbers, unknownDamagedCount) +
      damagedAtTheBeginning(record, numbers, unknownDamagedCount)
    )
  }
)

const possibleArrangements = (factor: number) => (row: string) => {
  const [recordSpec, numbersSpec] = row.split(' ')

  const record = repeat(recordSpec, factor).join('?').split('')
  const numbers = repeat(numbersSpec, factor).join(',').split(',').map(Number)

  const unknownDamagedCount = sum(numbers) - record.filter(equals('#')).length

  return tryNextArrangement(record, numbers, unknownDamagedCount)
}

const part1 = (factor: number, input?: string) =>
  sum(inputContentLines(input).map(possibleArrangements(factor)))

const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

test('acceptance of part 1', () => {
  expect(part1(1, testInput)).toEqual(21)
  expect(part1(1, inputContent('day12-input'))).toEqual(7007)
})

test('acceptance of part 2', () => {
  expect(part1(5, testInput)).toEqual(525152)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1(1))
  console.log('Part 2: ' + part1(5))
}
