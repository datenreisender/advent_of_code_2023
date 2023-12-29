/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, memoizeWith, always, min, sort, isNotNil, groupBy } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

type Location = {
  row: number
  col: number
}

type Attempt = {
  path: string
  loc: Location
  totalHeatloss: number
}

const part1 = (input?: string) => {
  const field = inputContentLines(input).map(
    pipe(
      split(''),
      map(char => ({
        heatloss: Number(char),
        best: {
          totalHeatloss: Number.MAX_SAFE_INTEGER,
          path: undefined as string | undefined
        }
      }))
    )
  )
  const maxRow = field.length - 1
  const maxCol = field[0].length - 1

  const possibleMoves = {
    '<': {
      rowDiff: 0,
      colDiff: -1,
      counter: '>',
      isNotValid: ({ col }: Location) => col === 0
    },
    '>': {
      rowDiff: 0,
      colDiff: 1,
      counter: '<',
      isNotValid: ({ col }: Location) => col === maxCol
    },
    v: {
      rowDiff: 1,
      colDiff: 0,
      counter: '^',
      isNotValid: ({ row }: Location) => row === maxRow
    },
    '^': {
      rowDiff: -1,
      colDiff: 0,
      counter: 'v',
      isNotValid: ({ row }: Location) => row === 0
    }
  }

  field[0][0].best = { totalHeatloss: 0, path: '' }

  const calcNextAttempts = attempt => {
    const newAttempts = Object.entries(possibleMoves)
      .map(([pathChar, { rowDiff, colDiff, isNotValid, counter }]) => {
        if (
          isNotValid(attempt.loc) ||
          attempt.path.endsWith(counter) ||
          attempt.path.endsWith(pathChar + pathChar + pathChar)
        )
          return

        const row = attempt.loc.row + rowDiff
        const col = attempt.loc.col + colDiff
        return {
          path: attempt.path + pathChar,
          loc: { row, col },
          totalHeatloss: attempt.totalHeatloss + field[row][col].heatloss
        }
      })
      .filter(Boolean)

    newAttempts
      .map(({ loc: { row, col }, totalHeatloss, path }) => {
        const current = field[row][col]
        if (current.best.totalHeatloss > totalHeatloss) {
          current.best = { totalHeatloss, path }
        }
      })
      .filter(Boolean)

    return newAttempts
  }

  let attempts: Attempt[] = calcNextAttempts({
    path: '',
    loc: { row: 0, col: 0 },
    totalHeatloss: 0
  })

  let steps = 0
  do {
    attempts = attempts.flatMap(calcNextAttempts)

    const pathsToRemove = []
    Object.values(
      groupBy(
        ({ loc: { col, row }, totalHeatloss }) =>
          row + '/' + col + '_' + totalHeatloss,
        attempts
      )
    ).flatMap(attemptsWithSameLoc => {
      const allDirections = Object.keys(possibleMoves)
      allDirections.forEach(dir => {
        const lengthsOfDirAtEnd = attemptsWithSameLoc
          .filter(({ path }) => path.endsWith(dir))
          .map(
            ({ path }) =>
              path.match(RegExp(dir.replace('^', '\\^') + '+$'))[0].length
          )
        if (lengthsOfDirAtEnd.length > 1) {
          const oneGoodAttempt = attemptsWithSameLoc.find(({ path }) =>
            path.match(
              RegExp(
                '(^|[^' +
                  dir +
                  '])' +
                  dir.replace('^', '\\^') +
                  '{' +
                  Math.min(...lengthsOfDirAtEnd) +
                  '}$'
              )
            )
          )

          pathsToRemove.push(
            ...attemptsWithSameLoc
              .filter(
                ({ path }) => path.endsWith(dir) && path !== oneGoodAttempt.path
              )
              .map(attempts => attempts.path)
          )
        }
      })
    })

    attempts = attempts.filter(
      ({ path, loc: { row, col }, totalHeatloss }) =>
        (row < maxRow || col < maxCol) &&
        totalHeatloss <= field[row][col].best.totalHeatloss + 3 &&
        !pathsToRemove.includes(path)
    )

    // steps++
    // console.log(steps, attempts.length)
  } while (attempts.length > 0 && steps < 500)

  return field[maxRow][maxCol].best.totalHeatloss
}

const testInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(102)
})

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  //   console.log('Part 1: ' + part1(inputContent(process.argv[2])))
  console.log('Part 1: ' + part1())
  //   console.log('Part 2: ' + part2())
}
