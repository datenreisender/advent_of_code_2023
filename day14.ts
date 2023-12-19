/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, sort } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

type Rock = {
  x: number
  y: number
  rolls: boolean
}

const findRocks = (rows: string[]): Rock[] =>
  rows.flatMap((row, rowIndex) =>
    row.split('').flatMap((char, x) => {
      switch (char) {
        case '.':
          return []
        case 'O':
          return { x, y: rows.length - rowIndex - 1, rolls: true }
        case '#':
          return { x, y: rows.length - rowIndex - 1, rolls: false }
      }
    })
  )

const rollNorth = (rocks: Rock[], width: number, height: number): Rock[] => {
  const northernMostPossible = new Array(width).fill(height - 1)

  return reverse(sortBy(prop('y'), rocks)).map(rock => {
    northernMostPossible[rock.x] =
      (rock.rolls ? northernMostPossible[rock.x] : rock.y) - 1

    return {
      ...rock,
      y: rock.rolls ? northernMostPossible[rock.x] + 1 : rock.y
    }
  })
}

const calcLoad = (rocks: Rock[], height: number) =>
  sum(rocks.filter(prop('rolls')).map(rock => rock.y + 1))

const printable = (rocks: Rock[], width: number, height: number) =>
  reverse(range(0, height))
    .map(y =>
      range(0, width)
        .map(x =>
          rocks.find(rock => rock.x === x && rock.y === y) == null
            ? '.'
            : rocks.find(rock => rock.x === x && rock.y === y).rolls
            ? 'O'
            : '#'
        )
        .join('')
    )
    .join('\n')

const part1 = (input?: string) => {
  const rows = inputContentLines(input)
  const width = rows[0].length
  const height = rows.length

  const rocks = findRocks(inputContentLines(input))
  const afterSingleRoll = rollNorth(rocks, width, height)

  return calcLoad(afterSingleRoll, height)
}

const testInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(136)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
