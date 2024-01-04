/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, min, max, sort } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars, emptyField, print } from './setup' // eslint-disable-line no-unused-vars

const allDirs = ['R', 'D', 'L', 'U'] as const
type Dir = (typeof allDirs)[number]

type Step = {
  dir: Dir
  distance: number
}

type Location = {
  row: number
  col: number
}

type HorizontalTrench = {
  row: number
  cols: { from: number; to: number }
  seperatesInAndOut: boolean
}

type VerticalTrench = {
  rows: { from: number; to: number }
  col: number
}

type Trench = HorizontalTrench | VerticalTrench

const isHorizontal = (trench: Trench): trench is HorizontalTrench =>
  trench != null && 'row' in trench

const nextLoc = ({ row, col }: Location, step: Step) => {
  switch (step.dir) {
    case 'R':
      return { row, col: col + step.distance }
    case 'L':
      return { row, col: col - step.distance }
    case 'D':
      return { row: row + step.distance, col }
    case 'U':
      return { row: row - step.distance, col }
  }
}

const parse1 = (input?: string): Step[] =>
  inputContentLines(input).map(line => {
    const [, dir, distance] = line.match(/([RLDU]) (\d+)/)

    return { dir: dir as Dir, distance: Number(distance) }
  })

const parse2 = (input?: string): Step[] =>
  inputContentLines(input).map(line => {
    const [, distance, dir] = line.match(/#(\w+)(\w)/)

    return { dir: allDirs[dir], distance: Number.parseInt(distance, 16) }
  })

const findTrenches = (path: Step[]) => {
  let here = { row: 0, col: 0 }

  return path.map((step, index) => {
    const there = nextLoc(here, step)
    let result: Trench
    if (['L', 'R'].includes(step.dir)) {
      // horizontal
      result = {
        row: here.row,
        cols: { from: min(here.col, there.col), to: max(here.col, there.col) },
        seperatesInAndOut:
          path.at(index - 1).dir === path.at(index + (1 % path.length)).dir,
      } as HorizontalTrench
    } else {
      // vertical
      result = {
        rows: { from: min(here.row, there.row), to: max(here.row, there.row) },
        col: here.col,
      } as VerticalTrench
    }

    here = there
    return result
  })
}

const includeNewRelevantTrenches = (
  relevantTrenches: Trench[],
  trenches: Trench[],
  row: number
) =>
  sortBy(
    trench => (isHorizontal(trench) ? trench.cols.from : trench.col),
    [
      ...relevantTrenches,
      ...trenches.filter(
        trench => row === (isHorizontal(trench) ? trench.row : trench.rows.from)
      ),
    ]
  )

const touchesHorizontal = (trench: VerticalTrench, trenches: Trench[]) =>
  trenches.some(
    other =>
      isHorizontal(other) &&
      (other.cols.from === trench.col || other.cols.to === trench.col)
  )

const dugInCurrentRow = (trenches: Trench[]) => {
  let sum = 0
  let currentlyInside = false

  trenches
    .filter(
      trench => isHorizontal(trench) || !touchesHorizontal(trench, trenches)
    )
    .forEach((trench, index, allCurrentTrenches) => {
      sum += isHorizontal(trench) ? trench.cols.to - trench.cols.from + 1 : 1

      const switchesBetweenInAndOut =
        !isHorizontal(trench) || trench.seperatesInAndOut
      currentlyInside = currentlyInside !== switchesBetweenInAndOut

      const nextTrench = allCurrentTrenches[index + 1]

      if (currentlyInside && nextTrench != null) {
        const from = isHorizontal(trench) ? trench.cols.to : trench.col
        const to = isHorizontal(nextTrench)
          ? nextTrench.cols.from
          : nextTrench.col

        sum += to - from - 1
      }
    })

  return sum
}

const compute = (path: Step[]) => {
  const trenches = findTrenches(path)
  const rowsWithHorizontals = compose(
    sort<number>(ascend(identity)),
    uniq,
    map(prop('row')),
    filter<Trench>(isHorizontal)
  )(trenches)

  let sum = 0
  let relevantTrenches: Trench[] = []

  rowsWithHorizontals.forEach((row, index) => {
    relevantTrenches = includeNewRelevantTrenches(
      relevantTrenches,
      trenches,
      row
    )

    sum += dugInCurrentRow(relevantTrenches)

    const nextRow = rowsWithHorizontals[index + 1]
    if (nextRow != null) {
      relevantTrenches = relevantTrenches.filter(
        trench => !isHorizontal(trench) && trench.rows.to !== row
      )
      sum += dugInCurrentRow(relevantTrenches) * (nextRow - row - 1)
    }
  })

  return sum
}

const part1 = (input?: string) => compute(parse1(input))
const part2 = (input?: string) => compute(parse2(input))

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

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(952408144115)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
}
