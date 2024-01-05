/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, tap } from 'ramda' // eslint-disable-line no-unused-vars
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

test('acceptance of part 1', () => {
  expect(part1(testInput)).toEqual(19114)
})

// test('acceptance of part 2', () => {
//   expect(part2(testInput)).toEqual(TODO)
// })

if (process.env.NODE_ENV !== 'test') {
  console.log('Part 1: ' + part1())
  // console.log('Part 2: ' + part2())
}
