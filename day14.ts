/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, sort } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

import { createHash } from 'node:crypto'

type Rock = {
  x: number
  y: number
  rolls: boolean
}

type Platform = { rocks: Rock[]; height: number; width: number }

const parsePlatform = (rows: string[]): Platform => ({
  height: rows.length,
  width: rows[0].length,

  rocks: rows.flatMap((row, rowIndex) =>
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
})

const roll =
  (orientation: 'horizontal' | 'vertical', direction: 'lower' | 'higher') =>
  ({ rocks, height, width }: Platform): Platform => {
    const currentBlockage = new Array(
      orientation === 'vertical' ? width : height
    ).fill(
      direction === 'lower'
        ? 0
        : (orientation === 'vertical' ? height : width) - 1
    )

    const maybeReverse = direction === 'lower' ? identity : reverse
    const mainProp = prop(orientation === 'vertical' ? 'y' : 'x')
    const crossProp = prop(orientation === 'vertical' ? 'x' : 'y')

    const down = add(direction === 'lower' ? 1 : -1)
    const up = add(direction === 'lower' ? -1 : 1)

    return {
      height,
      width,
      rocks: maybeReverse(sortBy(mainProp, rocks)).map(rock => {
        currentBlockage[crossProp(rock)] = down(
          rock.rolls ? currentBlockage[crossProp(rock)] : mainProp(rock)
        )

        return {
          ...rock,
          [orientation === 'vertical' ? 'y' : 'x']: rock.rolls
            ? up(currentBlockage[crossProp(rock)])
            : mainProp(rock)
        }
      })
    }
  }

const rollNorth = roll('vertical', 'higher')
const rollWest = roll('horizontal', 'lower')
const rollSouth = roll('vertical', 'lower')
const rollEast = roll('horizontal', 'higher')

const hash = (rocks: Rock[]) => {
  const rocksSortedByCoordinates = sortBy(
    compose(join('/'), props(['x', 'y'])),
    rocks
  )

  const hash = createHash('sha256')

  rocksSortedByCoordinates.forEach(rock => hash.update(`${rock.x} ${rock.y} `))
  return hash.digest('hex')
}

const calcLoad = ({ rocks }: Platform) =>
  sum(rocks.filter(prop('rolls')).map(rock => rock.y + 1))

const print = ({ rocks, width, height }: Platform) =>
  console.log(
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
  )

const part1 = (input?: string) =>
  pipe(parsePlatform, rollNorth, calcLoad)(inputContentLines(input))

const spin = (platform: Platform) =>
  pipe(rollNorth, rollWest, rollSouth, rollEast)(platform)

const part2 = (input?: string) => {
  const knownHashes = {}
  let spins = 0
  let platform = parsePlatform(inputContentLines(input))
  let currentHash = hash(platform.rocks)

  do {
    knownHashes[currentHash] = spins

    spins++
    platform = spin(platform)

    currentHash = hash(platform.rocks)
  } while (!(currentHash in knownHashes))

  const loopLength = spins - knownHashes[currentHash]
  const goalCycles = 1000000000
  const cyclesToSkip = Math.floor((goalCycles - spins) / loopLength)

  spins += cyclesToSkip * loopLength

  while (spins < goalCycles) {
    platform = spin(platform)
    spins++
  }

  return calcLoad(platform)
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

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(64)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
  // console.log('Part 2: ' + part2(testInput))
}
