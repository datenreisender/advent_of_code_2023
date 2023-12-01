/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const firstValue = (input: string) => input.match(/\d/)?.[0]!;
const lastValue = (input: string) => reverse(input).match(/\d/)?.[0]!;

const calibrationValue = (input: string) =>
  Number(firstValue(input) + replaceSpelledNumbers(lastValue(input)));
const part1 = (input: string) => sum(lines(input).map(calibrationValue));

const firstValue_ = (input: string) =>
  input.match(/\d|one|two|three|four|five|six|seven|eight|nine/)?.[0]!;
const lastValue_ = (input: string) =>
  reverse(
    reverse(input).match(
      /\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/
    )?.[0]!
  );

const replaceSpelledNumbers = (input: string) =>
  input
    .replace(/one/g, '1')
    .replace(/two/g, '2')
    .replace(/three/g, '3')
    .replace(/four/g, '4')
    .replace(/five/g, '5')
    .replace(/six/g, '6')
    .replace(/seven/g, '7')
    .replace(/eight/g, '8')
    .replace(/nine/g, '9');

const calibrationValue_ = (input: string) =>
  Number(
    replaceSpelledNumbers(firstValue_(input)) +
      replaceSpelledNumbers(lastValue_(input))
  );
const part2 = (input: string) => sum(lines(input).map(calibrationValue_));

test('acceptance of part 1', () => {
  expect(calibrationValue('1abc2')).toEqual(12);
  expect(calibrationValue('pqr3stu8vwx')).toEqual(38);
  expect(calibrationValue('a1b2c3d4e5f')).toEqual(15);
  expect(calibrationValue('treb7uchet')).toEqual(77);

  expect(
    part1(
      '1abc2\n' + //
        'pqr3stu8vwx\n' + //
        'a1b2c3d4e5f\n' + //
        'treb7uchet\n'
    )
  ).toEqual(142);
});

test('acceptance of part 2', () => {
  expect(calibrationValue_('two1nine')).toEqual(29);
  expect(calibrationValue_('eightwothree')).toEqual(83);
  expect(calibrationValue_('abcone2threexyz')).toEqual(13);
  expect(calibrationValue_('xtwone3four')).toEqual(24);
  expect(calibrationValue_('4nineeightseven2')).toEqual(42);
  expect(calibrationValue_('zoneight234')).toEqual(14);
  expect(calibrationValue_('7pqrstsixteen')).toEqual(76);

  expect(
    part2(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`)
  ).toEqual(281);
});

if (process.env.NODE_ENV !== 'test') {
  const input = inputContent();
  console.log('Part 1: ' + part1(input));
  console.log('Part 2: ' + part2(input));
}
