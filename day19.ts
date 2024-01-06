/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap, groupBy, product } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars, inspect } from './setup' // eslint-disable-line no-unused-vars

type Rule = {
  condition?: {
    prop: 'x' | 'm' | 'a' | 's'
    comparator: '<' | '>'
    value: number
  }
  result: string
}

type Part = {
  x: number
  m: number
  a: number
  s: number
}

const parseRule = (ruleSpec: string) => {
  const { prop, comparator, value, result } = ruleSpec.match(
    /((?<prop>\w)(?<comparator>[<>])(?<value>\d+):)?(?<result>.+)/
  ).groups

  return (
    prop == null
      ? { result }
      : { condition: { prop, comparator, value: Number(value) }, result }
  ) as Rule
}

const parseWorkflow = (workflowSpec: string) => {
  const { name, props } = workflowSpec.match(
    /(?<name>\w+)\{(?<props>\S*)\}/
  ).groups

  return [name, props.split(',').map(parseRule)] as const
}

const parsePart = (partSpec: string) => {
  const [, x, m, a, s] = partSpec.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/)
  return { x: Number(x), m: Number(m), a: Number(a), s: Number(s) }
}

const parse = (input?: string) => {
  const [workflowsSpecs, partsSpecs] = (input ?? inputContent())
    .trim()
    .split('\n\n')

  return {
    workflows: Object.fromEntries(lines(workflowsSpecs).map(parseWorkflow)),
    parts: lines(partsSpecs).map(parsePart),
  }
}

const isAccepted = (workflows: Record<string, Rule[]>) => (part: Part) => {
  let current = 'in'
  do {
    current = workflows[current].find(
      rule =>
        rule.condition == null ||
        (rule.condition.comparator === '<' &&
          part[rule.condition.prop] < rule.condition.value) ||
        (rule.condition.comparator === '>' &&
          part[rule.condition.prop] > rule.condition.value)
    ).result
  } while (current !== 'A' && current !== 'R')

  return current === 'A'
}

const part1 = (input?: string) => {
  const { workflows, parts } = parse(input)

  return sum(
    parts.filter(isAccepted(workflows)).map(part => sum(Object.values(part)))
  )
}

type Range = {
  current: string
  x: { from: number; to: number }
  m: { from: number; to: number }
  a: { from: number; to: number }
  s: { from: number; to: number }
}

const splitRange = (range: Range, rule: Rule) => {
  const { prop, comparator, value } = rule.condition ?? {}

  if (
    rule.condition == null ||
    (comparator === '<' && range[prop].to < value) ||
    (comparator === '>' && range[prop].from > value)
  ) {
    return [{ ...range, current: rule.result }]
  }

  if (comparator === '<' && range[prop].from < value) {
    return [
      { ...range, [prop]: { from: value, to: range[prop].to } },
      {
        ...range,
        current: rule.result,
        [prop]: { from: range[prop].from, to: value - 1 },
      },
    ]
  }

  if (comparator === '>' && range[prop].to > value) {
    return [
      {
        ...range,
        [prop]: { from: range[prop].from, to: value },
      },
      {
        ...range,
        current: rule.result,
        [prop]: { from: value + 1, to: range[prop].to },
      },
    ]
  }

  return [range]
}

const nextRanges = (workflows: Record<string, Rule[]>, range: Range) =>
  workflows[range.current].reduce(
    ([toSplit, ...rest], rule) => [...splitRange(toSplit, rule), ...rest],
    [range]
  )

const countParts = (range: Range) =>
  product([
    range.x.to - range.x.from + 1,
    range.m.to - range.m.from + 1,
    range.a.to - range.a.from + 1,
    range.s.to - range.s.from + 1,
  ])

const part2 = (input?: string) => {
  const { workflows } = parse(input)

  const partRanges = [
    {
      current: 'in',
      x: { from: 1, to: 4000 },
      m: { from: 1, to: 4000 },
      a: { from: 1, to: 4000 },
      s: { from: 1, to: 4000 },
    },
  ]

  let accepted = 0

  do {
    const next = groupBy(
      part =>
        part.current === 'A'
          ? 'accepted'
          : part.current === 'R'
          ? 'rejected'
          : 'continue',
      nextRanges(workflows, partRanges.pop())
    )

    accepted += compose(sum, map(countParts), propOr([], 'accepted'))(next)

    partRanges.push(...(next.continue ?? []))
  } while (partRanges.length > 0)

  return accepted
}

const testInput = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

test('splitRange', () => {
  const testRange = {
    current: 'old',
    x: { from: 1000, to: 2000 },
    m: { from: 1000, to: 2000 },
    a: { from: 1000, to: 2000 },
    s: { from: 1000, to: 2000 },
  }

  expect(splitRange(testRange, { result: 'new' })).toEqual([
    expect.objectContaining({ current: 'new' }),
  ])

  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '<', value: 1000 },
    })
  ).toEqual([expect.objectContaining({ current: 'old' })])
  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '>', value: 2000 },
    })
  ).toEqual([expect.objectContaining({ current: 'old' })])

  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '<', value: 2001 },
    })
  ).toEqual([expect.objectContaining({ current: 'new' })])
  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '>', value: 999 },
    })
  ).toEqual([expect.objectContaining({ current: 'new' })])

  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '<', value: 1500 },
    })
  ).toEqual([
    expect.objectContaining({ x: { from: 1500, to: 2000 }, current: 'old' }),
    expect.objectContaining({ x: { from: 1000, to: 1499 }, current: 'new' }),
  ])

  expect(
    splitRange(testRange, {
      result: 'new',
      condition: { prop: 'x', comparator: '>', value: 1500 },
    })
  ).toEqual([
    expect.objectContaining({ x: { from: 1000, to: 1500 }, current: 'old' }),
    expect.objectContaining({ x: { from: 1501, to: 2000 }, current: 'new' }),
  ])
})

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(19114)
})

test('acceptance of part 2', () => {
  expect(part2(testInput)).toEqual(167409079868000)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  console.log('Part 2: ' + part2())
}
