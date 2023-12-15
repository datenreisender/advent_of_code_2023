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

const tileInDir = (tile: Tile, dir: Dir) =>
  ({
    [Up]: above(tile),
    [Down]: below(tile),
    [Left]: leftOf(tile),
    [Right]: rightOf(tile)
  }[dir])

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
    tile: tileInDir(entry.tile, nextEntryDirection),
    entryDirection: nextEntryDirection
  }
}

const walkThePipe = (
  field: string[],
  entry: PipePart,
  cb: (current: PipePart) => void
) => {
  let here = entry

  do {
    here = nextTile(field, here)
    cb(here)
  } while (lookup(field, here.tile) !== 'S')
}

const countTillStart = (field: string[], entry: PipePart) => {
  let steps = 1

  walkThePipe(field, entry, () => steps++)

  return steps / 2
}

const part1 = (input?: string) => {
  const field = inputContentLines(input)
  const entry = findEntry(field, findStart(field))

  return countTillStart(field, entry)
}

const findWholePipe = (field: string[], entry: PipePart) => {
  const pipe = [entry.tile]

  walkThePipe(field, entry, current => pipe.push(current.tile))

  return pipe
}

const neighbouringTiles = {
  '-': { direction: Right, left: [Up], right: [Down] },
  '|': { direction: Up, left: [Left], right: [Right] },
  '7': { direction: Up, left: [], right: [Up, Right] },
  F: { direction: Up, left: [Left, Up], right: [] },
  J: { direction: Right, left: [], right: [Down, Right] },
  L: { direction: Left, left: [Down, Left], right: [] }
}

const pipeContainsTile = (pipe: Tile[], tile: Tile) =>
  -1 ===
  pipe.findIndex(pipeTile => pipeTile[0] === tile[0] && pipeTile[1] === tile[1])

const setTile = (field: string[], tile: Tile, fillChar: string) => {
  const originalRow = field[tile[0]]

  field[tile[0]] =
    originalRow.substring(0, tile[1]) +
    fillChar +
    originalRow.substring(tile[1] + 1)
}

const floodFillAroundTile = (
  field: string[],
  pipe: Tile[],
  fillChar: string,
  current: Tile,
  startingDirs: Dir[]
) => {
  const tilesToFill: Tile[] = startingDirs.map(dir => tileInDir(current, dir))

  while (tilesToFill.length > 0) {
    const tile = tilesToFill.pop()

    const currentFill = lookup(field, tile)
    const canBeFilled =
      currentFill != null &&
      currentFill !== fillChar &&
      pipeContainsTile(pipe, tile)

    if (canBeFilled) {
      setTile(field, tile, fillChar)
      tilesToFill.push(above(tile), below(tile), leftOf(tile), rightOf(tile))
    }
  }
}

const floodFillAroundPipe = (
  field: string[],
  pipe: Tile[],
  current: PipePart
) => {
  if (lookup(field, current.tile) === 'S') return

  const neighbouring = neighbouringTiles[lookup(field, current.tile)]
  const isCorrectDirection = neighbouring.direction === current.entryDirection

  floodFillAroundTile(
    field,
    pipe,
    isCorrectDirection ? 'l' : 'r',
    current.tile,
    neighbouring.left
  )

  floodFillAroundTile(
    field,
    pipe,
    isCorrectDirection ? 'r' : 'l',
    current.tile,
    neighbouring.right
  )
}

const floodFill = (field: string[], pipe: Tile[], entry: PipePart) => {
  floodFillAroundPipe(field, pipe, entry)

  walkThePipe(field, entry, current =>
    floodFillAroundPipe(field, pipe, current)
  )
}

const countInsideTiles = (field: string[]) =>
  Math.min(
    sum(field.map(row => row.split('').filter(s => s === 'l').length)),
    sum(field.map(row => row.split('').filter(s => s === 'r').length))
  )

const part2 = (input?: string) => {
  const field = inputContentLines(input)
  const entry = findEntry(field, findStart(field))
  const pipe = findWholePipe(field, entry)
  floodFill(field, pipe, entry)

  return countInsideTiles(field)
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
LJ.LJ`,
  `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
  `
..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`,
  `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
  `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`
]

test('acceptance of part 1', () => {
  expect(part1(testInput[0])).toEqual(4)
  expect(part1(testInput[1])).toEqual(8)
})

test('acceptance of part 2', () => {
  expect(part2(testInput[2])).toEqual(4)
  expect(part2(testInput[3])).toEqual(4)
  expect(part2(testInput[4])).toEqual(8)
  expect(part2(testInput[5])).toEqual(10)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContent()
  console.log('Part 1: ' + part1(input))
  console.log('Part 2: ' + part2(input))
}
