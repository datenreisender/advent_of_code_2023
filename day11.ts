/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

type Star = {
  row: number
  col: number
}

const findStars = (
  field: string[]
): { stars: Star[]; maxRow: number; maxCol: number } => ({
  stars: field.flatMap((rowString, row) =>
    rowString
      .split('')
      .map((char, col) => char === '#' && { row, col })
      .filter(o => typeof o === 'object')
  ),
  maxRow: field.length,
  maxCol: field[0].length
})

const correctByExpansion = ({
  stars,
  maxRow,
  maxCol
}: {
  stars: Star[]
  maxRow: number
  maxCol: number
}): Star[] => {
  const emptyRows = range(0, maxRow).filter(row =>
    stars.every(star => row !== star.row)
  )
  const emptyCols = range(0, maxCol).filter(col =>
    stars.every(star => col !== star.col)
  )

  return stars.map(star => ({
    row: star.row + emptyRows.filter(emptyRow => emptyRow < star.row).length,
    col: star.col + emptyCols.filter(emptyCol => emptyCol < star.col).length
  }))
}

const sumDistances = (stars: Star[]): number => {
  let sum = 0
  for (let i = 0; i < stars.length - 1; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      sum += Math.abs(stars[i].row - stars[j].row)
      sum += Math.abs(stars[i].col - stars[j].col)
    }
  }

  return sum
}

const part1 = (input?: string) =>
  pipe(findStars, correctByExpansion, sumDistances)(inputContentLines(input))
const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(374)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2(input))
}
