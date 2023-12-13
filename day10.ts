/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

type Tile = [row: number, col: number]
type PipePart = { tile: Tile; entryDirection: Dir }

enum Dir {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left'
}

const { Up, Right, Down, Left } = Dir

const findStart = (field: string[]): Tile => {
  const row = field.findIndex(s => s.includes('S'))
  const col = field[row].indexOf('S')

  return [row, col]
}

const nextDirection = {
  [Up]: {
    '|': Up,
    '7': Left,
    F: Right
  },
  [Right]: {
    '-': Right,
    J: Up,
    '7': Down
  },
  [Down]: {
    '|': Down,
    J: Left,
    L: Right
  },
  [Left]: {
    '-': Left,
    F: Down,
    L: Up
  }
}

const above = (tile: Tile): Tile => [tile[0] - 1, tile[1]]
const below = (tile: Tile): Tile => [tile[0] + 1, tile[1]]
const leftOf = (tile: Tile): Tile => [tile[0], tile[1] - 1]
const rightOf = (tile: Tile): Tile => [tile[0], tile[1] + 1]

const lookup = (field: string[], tile: Tile): string | undefined =>
  field[tile[0]]?.[tile[1]]

const maybeEntry = (field: string[], entryDirection: Dir, tile: Tile) =>
  nextDirection[entryDirection][lookup(field, tile)] == null
    ? undefined
    : { tile, entryDirection }

const entryUp = (field: string[], start: Tile): PipePart | undefined =>
  maybeEntry(field, Up, above(start))

const entryLeft = (field: string[], start: Tile): PipePart | undefined =>
  maybeEntry(field, Left, leftOf(start))

const entryDown = (field: string[], start: Tile): PipePart | undefined =>
  maybeEntry(field, Down, below(start))

const findEntry = (...params: [string[], Tile]): PipePart =>
  entryUp(...params) ?? entryLeft(...params) ?? entryDown(...params)

const nextTile = (field: string[], entry: PipePart): PipePart => {
  const nextEntryDirection =
    nextDirection[entry.entryDirection][lookup(field, entry.tile)]

  return {
    tile: {
      [Up]: above(entry.tile),
      [Down]: below(entry.tile),
      [Left]: leftOf(entry.tile),
      [Right]: rightOf(entry.tile)
    }[nextEntryDirection],
    entryDirection: nextEntryDirection
  }
}

const countTillStart = (field: string[], entry: PipePart) => {
  let steps = 1
  let here = entry

  do {
    steps++
    here = nextTile(field, here)
  } while (lookup(field, here.tile) !== 'S')

  return steps / 2
}

const part1 = (input?: string) => {
  const field = inputContentLines(input)
  const entry = findEntry(field, findStart(field))

  return countTillStart(field, entry)
}

const testInput = [
  `
.....
.S-7.
.|.|.
.L-J.
.....`,
  `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`
]

test('acceptance of part 1', () => {
  expect(part1(testInput[0])).toEqual(4)
  expect(part1(testInput[1])).toEqual(8)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContent()
  console.log('Part 1: ' + part1(input))
  // console.log('Part 2: ' + part2(input))
}
