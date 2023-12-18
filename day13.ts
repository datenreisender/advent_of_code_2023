/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, trim, splitAt } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars, paragraphs } from './setup' // eslint-disable-line no-unused-vars

const isReflectionAfter = (rows: string[]) => (row: number) =>
  range(0, row).every(
    index =>
      rows[row - index - 1] === rows[row + index] || row + index >= rows.length
  )

const findReflection = (rows: string[]) =>
  range(1, rows.length).find(isReflectionAfter(rows))

const cols = (rows: string[]) =>
  range(0, rows[0].length).map(index => rows.map(prop(index)).join(''))
const reflectingCol = (rows: string[]) => findReflection(cols(rows))

const reflectingRow = (rows: string[]) => findReflection(rows) * 100

const reflectionLine = (rows: string[]) =>
  reflectingCol(rows) ?? reflectingRow(rows)

const part1 = (input = inputContent()) =>
  pipe(paragraphs, map(lines), map(reflectionLine), sum)(input)

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

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
