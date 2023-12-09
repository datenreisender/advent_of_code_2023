/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, min } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const part1 = (input: string) => {
  const seeds = input
    .match(/seeds: ([\d ]+)/)[1]
    .split(' ')
    .map(Number)

  const mappings = Object.fromEntries(
    [...input.matchAll(/(\w+)-to-(\w+) map:([\d\s]+)/gm)].map(
      ([, from, to, mapSpec]) => [
        from,
        {
          from,
          to,
          mapSpec: mapSpec
            .trim()
            .split('\n')
            .map(line => {
              const mapping = line.split(' ').map(Number)

              return {
                toRange: {
                  start: mapping[0]
                },
                fromRange: {
                  start: mapping[1],
                  end: mapping[1] + mapping[2] - 1
                }
              }
            })
        }
      ]
    )
  )

  const seedLocations = seeds.map(seed => {
    let currentType = 'seed'
    let currentValue = seed

    do {
      const mapping = mappings[currentType]
      currentType = mapping.to
      let foundMapping = false

      Object.values(mapping.mapSpec).forEach(({ fromRange, toRange }) => {
        if (
          !foundMapping &&
          fromRange.start <= currentValue &&
          currentValue <= fromRange.end
        ) {
          currentValue = toRange.start + (currentValue - fromRange.start)
          foundMapping = true
        }
      })
    } while (currentType !== 'location')

    return currentValue
  })

  return Math.min(...seedLocations)
}

const testInput = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(35)
})

if (process.env.NODE_ENV !== 'test') {
  const input = inputContent()
  console.log('Part 1: ' + part1(input))
  // console.log('Part 2: ' + part2(input))
}
