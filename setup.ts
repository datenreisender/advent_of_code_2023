import { clone, identity, split, times } from 'ramda'

const justDuringTest = <T>(valueWhenRunningAsTest: T) =>
  process.env.NODE_ENV === 'test' ? valueWhenRunningAsTest : () => {}

export const describe = justDuringTest(global.describe)
export const expect = justDuringTest(global.expect)
export const test = justDuringTest(global.test)
export const xtest = justDuringTest(global.xtest)

export const TODO = identity

const readFile = (name: string): string =>
  require('fs').readFileSync(name, { encoding: 'utf8' })

const lineIsNotEmpty = (line: string) => line.length !== 0
export const paragraphs = (input: string) => input.trim().split('\n\n')
export const lines = (input: string) =>
  input.trim().split('\n').filter(lineIsNotEmpty)
export const chars = (input: any) => lines(input).map(split(''))

const baseFilename = () => process.argv[1].match(/(day\d+)(.ts)?$/)?.[1]
export const inputContent = (filename = baseFilename() + '-input') =>
  readFile(filename)
export const inputContentLines = (text = inputContent()) => lines(text)
export const inputContentChars = (text = inputContent()) => chars(text)

export const emptyField = <T>(height: number, width: number, value?: T) => {
  const emptyRow = times(() => value, width)
  return times(() => clone(emptyRow), height)
}

export const print = (field: unknown[][], defaultTile = '·') =>
  console.log(
    field
      .map(row => row.map(tile => (tile == null ? defaultTile : tile)).join(''))
      .join('\n')
  )
