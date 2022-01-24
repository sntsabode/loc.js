import { unsafe } from '../../lib/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
export default class ArgParser<Argv extends { }> {
  private args: ArgParserArg<Argv>[] = []

  #argv = process.argv
  #args = { } as Argv
  #i = 0

  get staged_args(): Argv { return this.#args }

  arg(arg: keyof Argv, options: ArgParserOption<Argv>): ArgParser<Argv> {
    this.args.push({ arg: arg as string, ...options })
    return this
  }

  insert<T>(arg: keyof Argv, val: T): ArgParser<Argv> {
    this.#args[arg] = val as unsafe
    return this
  }

  get argv(): Argv {
    for (const arg of this.#argv) {
      this.processArg(arg)
      this.#i++
    }

    return this.#args
  }

  private processArg(arg: string) {
    const i = this.args.findIndex(
      a => (!!a.alias && a.alias === arg.substring(1))
        || a.arg === arg.substring(2)
    )
    if (i === -1) { return }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.matchArg(this.args[i]!)
  }

  private matchArg(arg: ArgParserArg<Argv>) {
    switch (arg.type) {
      case 'string':
      case 'number':
        this.processLookAhead(arg); break

      case 'array':
        this.processArray(arg); break

      case 'boolean':
      default:
        this.#args[arg.arg] = true; break
    }
  }

  private processLookAhead(arg: ArgParserArg<Argv>) {
    this.#i++
    this.#args[arg.arg] = arg.sanitizer
      ? arg.sanitizer(this.#argv[this.#i], this)
      : this.#argv[this.#i]
  }

  private processArray(arg: ArgParserArg<Argv>) {
    this.#args[arg.arg] = []
    this.#i++

    while (this.#i < this.#argv.length) {
      const a = this.#argv[this.#i]

      if (
        /-[\w](?!\w)/.test(a)
        || /--[\w]+/.test(a)
      ) { this.#i--; break }

      this.#args[arg.arg].push(
        arg.sanitizer ? arg.sanitizer(a, this) : a
      )

      this.#i++
    }
  }
}

export type ArgParserArg<T> = ArgParserOption<T> & { arg: string }

export interface ArgParserOption<T> {
  alias?: string
  type: keyof ArgParserType
  describe?: string
  default?: ArgParserType
  sanitizer?: (v: string, sup: ArgParser<T>) => ArgParserType[keyof ArgParserType]
}

export interface ArgParserType {
  'boolean': boolean
  'string': string
  'number': number
  'array': string[]
}
