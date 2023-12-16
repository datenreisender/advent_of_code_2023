/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const checkForValidCombo = (record: string[], numbers: number[]) => {
  const numbersToTry = record
    .map(char => (char === '?' ? '.' : char))
    .join('')
    .split(/\.+/)
    .filter(Boolean)
    .map(s => s.length)

  return equals(numbersToTry, numbers)
}

const tryNextArrangement = (
  fixedRecord: string[],
  recordToInvestigate: string[],
  numbers: number[],
  unknownSpringCount: number
) => {
  if (unknownSpringCount === 0) {
    return checkForValidCombo(fixedRecord.concat(recordToInvestigate), numbers)
  }

  const [charToInvestigate, ...rest] = recordToInvestigate

  if (charToInvestigate == null) return 0

  if (charToInvestigate === '.' || charToInvestigate === '#') {
    return tryNextArrangement(
      fixedRecord.concat(charToInvestigate),
      rest,
      numbers,
      unknownSpringCount
    )
  }

  return (
    tryNextArrangement(
      fixedRecord.concat('.'),
      rest,
      numbers,
      unknownSpringCount
    ) +
    tryNextArrangement(
      fixedRecord.concat('#'),
      rest,
      numbers,
      unknownSpringCount - 1
    )
  )
}

const possibleArrangements = (row: string) => {
  const [recordSpec, numbersSpec] = row.split(' ')
  const record = recordSpec.split('')
  const numbers = numbersSpec.split(',').map(Number)

  const unknownSpringCount = sum(numbers) - record.filter(equals('#')).length

  return tryNextArrangement([], record, numbers, unknownSpringCount)
}

const part1 = (input?: string) =>
  sum(inputContentLines(input).map(possibleArrangements))

const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(21)
})

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
