/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars, emptyField, print } from './setup' // eslint-disable-line no-unused-vars
import { terminal as term } from 'terminal-kit'

type Tile = '#' | '.' | 'O'

const allDirs = ['R', 'L', 'U', 'D'] as const
type Dir = typeof allDirs[number]

type Step = {
  dir: Dir
  distance: number
}

type Location = {
  row: number
  col: number
}

const nextLoc =
  ({ row, col }: Location) =>
  (dir: Dir) => {
    switch (dir) {
      case 'R':
        return { row, col: col + 1 }
      case 'L':
        return { row, col: col - 1 }
      case 'D':
        return { row: row + 1, col }
      case 'U':
        return { row: row - 1, col }
    }
  }

const draw = (path: Step[]) => {
  const dig = () => {
    term.saveCursor()
    term('#')
    term.restoreCursor()
  }

  const move = {
    R: term.right,
    L: term.left,
    U: term.up,
    D: term.down
  }

  term.clear()

  term.moveTo(term.width / 2, term.height / 2)
  dig()
  path.forEach(step =>
    times(() => {
      move[step.dir](1)
      dig()
    }, step.distance)
  )

  term.moveTo(1, term.height)
}

const findSize = (path: Step[]) => {
  let here = { row: 0, col: 0 }
  const min = { row: 0, col: 0 }
  const max = { row: 0, col: 0 }

  path.forEach(step => {
    times(() => {
      here = nextLoc(here)(step.dir)
    }, step.distance)

    min.row = Math.min(min.row, here.row)
    min.col = Math.min(min.col, here.col)
    max.row = Math.max(max.row, here.row)
    max.col = Math.max(max.col, here.col)
  })

  return {
    maxRow: max.row - min.row,
    maxCol: max.col - min.col,
    start: { row: -min.row, col: -min.col }
  }
}

const digPath = (field: Tile[][], path: Step[], start: Location) => {
  let here = start
  field[here.row][here.col] = '#'

  path.forEach(step => {
    times(() => {
      here = nextLoc(here)(step.dir)
      field[here.row][here.col] = '#'
    }, step.distance)
  })
}

const floodOutside = (field: Tile[][]) => {
  const toFill = [
    ...range(0, field.length).flatMap(row => [
      { row, col: 0 },
      { row, col: field[0].length - 1 }
    ]),
    ...range(0, field[0].length).flatMap(col => [
      { row: 0, col },
      { row: field.length - 1, col }
    ])
  ]

  while (toFill.length > 0) {
    const tile = toFill.pop()
    if (field[tile.row]?.[tile.col] !== '.') continue

    field[tile.row][tile.col] = 'O'
    toFill.push(...allDirs.map(nextLoc(tile)))
  }
}

const parse = (input?: string): Step[] =>
  inputContentLines(input).map(line => {
    const [, dir, distance] = line.match(/([RLDU]) (\d+)/)

    return { dir: dir as Dir, distance: Number(distance) }
  })

const part1 = (input?: string) => {
  const path = parse(input)
  const { maxRow, maxCol, start } = findSize(path)

  const field = emptyField(maxRow + 1, maxCol + 1, '.' as Tile)

  digPath(field, path, start)
  floodOutside(field)

  return sum(field.map(row => row.filter(complement(equals('O'))).length))
}

const testInput = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(62)
})

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  // draw(parse(testInput))
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
