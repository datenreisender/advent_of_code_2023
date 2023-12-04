/* eslint-env jest */
// prettier-ignore
import { values, toPairs, splitEvery, range, reduce, maxBy, minBy, prop, equals, sum, isEmpty, complement, propEq, either, times, propOr, __, pathOr, insert, repeat, zip, flatten, remove, over, add, lensIndex, scan, clone, contains, dropLast, pipe, identity, evolve, subtract, concat, flip, replace, split, join, props, sortBy, forEach, last, map, path, pathEq, reject, compose, uniq, chain, sortWith, ascend, reverse, identical, filter, gt, curry, pluck, without, update, multiply, match, gte, keys, xprod, T, product, tap } from 'ramda' // eslint-disable-line no-unused-vars
// prettier-ignore
import { expect, describe, test, xtest, TODO, inputContent, inputContentLines, inputContentChars, lines, chars } from './setup' // eslint-disable-line no-unused-vars

const isValidDrawPart = (drawPart: string) => {
  const [, numberStr, color] = drawPart.trim().match(/(\d+) (\w+)/);
  const number = Number(numberStr);

  return (
    (color === 'red' && number <= 12) ||
    (color === 'green' && number <= 13) ||
    (color === 'blue' && number <= 14)
  );
};

const isValidDraw = (draw: string) => draw.split(',').every(isValidDrawPart);

const isValidGame = (game: string) =>
  game
    .replace(/^Game \d+: /, '')
    .split(';')
    .every(isValidDraw);

const idOfGame = (game: string) => Number(game.match(/^Game (\d+)/)?.[1]!);

const part1 = pipe<string[][], string[], number[], number>(
  filter(isValidGame),
  map(idOfGame),
  sum
);

const minimumCubeCount = (game: string) =>
  reduce(
    (acc, draw) => {
      const red = Number(draw.match(/(\d+) red/)?.[1] || 0);
      const green = Number(draw.match(/(\d+) green/)?.[1] || 0);
      const blue = Number(draw.match(/(\d+) blue/)?.[1] || 0);
      return [
        Math.max(red, acc[0]),
        Math.max(green, acc[1]),
        Math.max(blue, acc[2]),
      ];
    },
    [0, 0, 0],
    game.split(';')
  );

const part2 = pipe<string[][], number[][], number[], number>(
  map(minimumCubeCount),
  map(product),
  sum
);

const testInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

test('acceptance of part 1', () => {
  expect(part1(inputContentLines(testInput))).toEqual(8);
});

test('acceptance of part 2', () => {
  expect(part2(inputContentLines(testInput))).toEqual(2286);
});

if (process.env.NODE_ENV !== 'test') {
  const input = inputContentLines();
  console.log('Part 1: ' + part1(input));
  console.log('Part 2: ' + part2(input));
}
