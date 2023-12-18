/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, trim, splitAt } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars, paragraphs } from './setup' // eslint-disable-line no-unused-vars

const isReflectionAfter = (rows: string[][]) => (row: number) =>
  range(0, row).every(
    index =>
      equals(rows[row - index - 1], rows[row + index]) ||
      row + index >= rows.length
  )

const findReflection = (rows: string[][], factor = 1, rowToSkip?: number) => {
  const result = range(1, rows.length)
    .filter(complement(equals(rowToSkip)))
    .find(isReflectionAfter(rows))

  return result == null ? undefined : result * factor
}

const cols = (rows: string[][]) =>
  range(0, rows[0].length).map(index => rows.map(prop(index)))

const reflectionLine = (rows: string[][]) =>
  findReflection(cols(rows)) ?? findReflection(rows, 100)

const part = (input: string, getReflectionLine: typeof reflectionLine) =>
  pipe(
    paragraphs,
    map(lines),
    map(map(split(''))),
    map(getReflectionLine),
    sum
  )(input)

const part1 = (input = inputContent()) => part(input, reflectionLine)

const findReflectionWithFlip = (rows: string[][], factor = 1) => {
  const origReflection = findReflection(rows)

  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[0].length; col++) {
      const cloned = clone(rows)
      cloned[row][col] = cloned[row][col] === '.' ? '#' : '.'

      const newReflection = findReflection(cloned, factor, origReflection)

      if (newReflection != null) return newReflection
    }
  }
}

const reflectionLineAfterFlip = (rows: string[][]) => {
  return findReflectionWithFlip(cols(rows)) ?? findReflectionWithFlip(rows, 100)
}

const part2 = (input = inputContent()) => part(input, reflectionLineAfterFlip)

const testInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(405)
})

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(400)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
}
