/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const print = energized =>
  console.log(
    range(0, energized.length)
      .map(row =>
        range(0, energized[row].length)
          .map(col => (energized[row][col].length > 0 ? '#' : '.'))
          .join('')
      )
      .join('\n')
  )

const solve = (
  field: string[][],
  startBeam: { x: number; y: number; dir: { x: number; y: number } }
) => {
  const height = field.length
  const width = field[0].length

  const emptyRow = range(0, height).map((): string[] => [])
  const energized = range(0, width).map(() => clone(emptyRow))

  const beams = [startBeam]

  while (beams.length > 0) {
    const beam = beams[0]

    if (energized[beam.y][beam.x].includes(beam.dir.x + '/' + beam.dir.y)) {
      beams.shift()
    } else {
      energized[beam.y][beam.x].push(beam.dir.x + '/' + beam.dir.y)

      switch (field[beam.y][beam.x]) {
        case '/':
          ;[beam.dir.x, beam.dir.y] = [-beam.dir.y, -beam.dir.x]
          break
        case '\\':
          ;[beam.dir.x, beam.dir.y] = [beam.dir.y, beam.dir.x]
          break
        case '|':
          if (beam.dir.x !== 0) {
            beams.shift()
            beams.unshift(
              { x: beam.x, y: beam.y, dir: { x: 0, y: 1 } },
              { x: beam.x, y: beam.y, dir: { x: 0, y: -1 } }
            )
          }
          break
        case '-':
          if (beam.dir.y !== 0) {
            beams.shift()
            beams.unshift(
              { x: beam.x, y: beam.y, dir: { x: 1, y: 0 } },
              { x: beam.x, y: beam.y, dir: { x: -1, y: 0 } }
            )
          }
          break
      }

      beam.x += beam.dir.x
      beam.y += beam.dir.y

      if (field[beam.y]?.[beam.x] == null) {
        beams.shift()
      }
    }
  }

  return energized.flatMap(row => row.filter(cell => cell.length > 0)).length
}

const part1 = (input?: string) => {
  const field = inputContentLines(input).map(split(''))

  return solve(field, { x: 0, y: 0, dir: { x: 1, y: 0 } })
}

const part2 = (input?: string) => {
  const field = inputContentLines(input).map(split(''))
  const height = field.length
  const width = field[0].length

  return Math.max(
    ...range(0, width).flatMap(col => [
      solve(field, { x: col, y: 0, dir: { x: 0, y: 1 } }),
      solve(field, { x: col, y: height - 1, dir: { x: 0, y: -1 } })
    ]),
    ...range(0, height).flatMap(row => [
      solve(field, { y: row, x: 0, dir: { x: 1, y: 0 } }),
      solve(field, { y: row, x: width - 1, dir: { x: -1, y: 0 } })
    ])
  )
}

const testInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(46)
})

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(51)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
}
