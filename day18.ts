/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars
import { terminal as term } from 'terminal-kit'

type Step = {
  dir: 'R' | 'L' | 'U' | 'D'
  distance: number
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

const parse = (input?: string): Step[] =>
  inputContentLines(input).map(line => {
    const [, dir, distance] = line.match(/([RLDU]) (\d+)/)

    return { dir: <'R' | 'L' | 'U' | 'D'>dir, distance: Number(distance) }
  })

const part1 = (input?: string) => {
  const path = parse(input)
  // TODO
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
  draw(parse(testInput))
  //   console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
