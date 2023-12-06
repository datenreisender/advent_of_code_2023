/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, find, assoc } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const findAllNumbers = (line: string) =>
  [...line.matchAll(/\d+/g)].map((match: RegExpMatchArray) => ({
    value: Number(match[0]),
    start: match.index!,
    end: match.index + match[0].length - 1
  }))

test('findAllNumbers', () => {
  expect(findAllNumbers('..')).toEqual([])
  expect(findAllNumbers('467..114..')).toEqual([
    { value: 467, start: 0, end: 2 },
    { value: 114, start: 5, end: 7 }
  ])
})

const isSymbol = (char?: string) =>
  char != null &&
  char !== '.' &&
  char !== '0' &&
  char !== '1' &&
  char !== '2' &&
  char !== '3' &&
  char !== '4' &&
  char !== '5' &&
  char !== '6' &&
  char !== '7' &&
  char !== '8' &&
  char !== '9'

const symbolIn = (line: string, start: number, end: number) => {
  for (let i = start; i <= end; i++) {
    if (isSymbol(line[i])) {
      return true
    }
  }
  return false
}

const hasAdjacentSymbol =
  (previousLine = '', currentLine: string, nextLine = '') =>
  ({ start, end }: { start: number; end: number }) =>
    symbolIn(previousLine, start - 1, end + 1) ||
    isSymbol(currentLine[start - 1]) ||
    isSymbol(currentLine[end + 1]) ||
    symbolIn(nextLine, start - 1, end + 1)

const partSumInLine = (
  currentLine: string,
  index: number,
  allLines: string[]
) =>
  pipe(
    findAllNumbers,
    filter(
      hasAdjacentSymbol(
        allLines[index - 1],
        allLines[index],
        allLines[index + 1]
      )
    ),
    map(prop('value')),
    sum
  )(currentLine)

test('partSumInLine', () => {
  expect(partSumInLine('467..114..', 0, ['467..114..', '...*......'])).toEqual(
    467
  )
})

const part1 = (input: string[]) => sum(input.map(partSumInLine))

const testInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`

test('acceptance of part 1', () => {
  expect(part1(inputContentLines(testInput))).toEqual(4361)
})

type NumberInField = {
  value: number
  line: number
  start: number
  end: number
}

const findNumbersInField = (input: string[]): NumberInField[] =>
  input.flatMap((line, lineIndex) =>
    findAllNumbers(line).map(assoc('line', lineIndex))
  )

const findStarsInField = (input: string[]): { line: number; pos: number }[] =>
  input.flatMap((line, lineIndex) =>
    [...line.matchAll(/\*/g)].map((match: RegExpMatchArray) => ({
      line: lineIndex,
      pos: match.index
    }))
  )

const isNextTo = (line: number, pos: number) => (number: NumberInField) => {
  const isOnRightLine = line >= number.line - 1 && line <= number.line + 1
  const isRightBeforeStar = number.end + 1 === pos
  const isRightAfterStar = number.start - 1 === pos
  const isWithinStarRange = number.start <= pos && number.end >= pos

  return (
    isOnRightLine &&
    (isRightBeforeStar || isRightAfterStar || isWithinStarRange)
  )
}

const findAdjacentNumbers = (
  numbers: NumberInField[],
  line: number,
  pos: number
) => numbers.filter(isNextTo(line, pos)).map(prop('value'))

const gearRatios = (
  numbers: { value: number; line: number; start: number; end: number }[],
  stars: { line: number; pos: number }[]
) =>
  stars.map(({ line, pos }) => {
    const adjacentNumbers = findAdjacentNumbers(numbers, line, pos)

    return adjacentNumbers.length === 2
      ? adjacentNumbers[0] * adjacentNumbers[1]
      : 0
  })

const part2 = (input: string[]) =>
  sum(gearRatios(findNumbersInField(input), findStarsInField(input)))

test('acceptance of part 2', () => {
  expect(part2(inputContentLines(testInput))).toEqual(467835)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContentLines()
  console.log('Part 1: ' + part1(input))
  console.log('Part 2: ' + part2(input))
}
