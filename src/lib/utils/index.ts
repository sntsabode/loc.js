import { createInterface } from 'readline'

export type nil<T = undefined> = undefined | T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type unsafe = any

export async function ask(log: string): Promise<string> {
  const read = createInterface(process.stdin, process.stdout)
  return new Promise((resolve) => {
    read.question(log, (answer) => {
      read.close()
      resolve(answer)
    })
  })
}
