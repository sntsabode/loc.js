// eslint-disable-next-line @typescript-eslint/ban-types
export default class ArgParser<Argv extends { }> {
  private args: ArgParserArg[] = []

  #argv = process.argv
  #args = { } as Argv
  #i = 0

  arg(arg: string, options: ArgParserOption): ArgParser<Argv> {
    this.args.push({ arg, ...options })
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

  private matchArg(arg: ArgParserArg) {
    switch (arg.type) {
      case 'string':
      case 'number':
        this.processLookAhead(arg); break

      case 'boolean':
      default:
        this.#args[arg.arg] = true; break
    }
  }

  private processLookAhead(arg: ArgParserArg) {
    this.#i++
    this.#args[arg.arg] = this.#argv[this.#i]
  }
}

export type ArgParserArg = ArgParserOption & { arg: string }

export interface ArgParserOption {
  alias?: string
  type: keyof ArgParserType
  describe?: string
  default?: ArgParserType
}

export interface ArgParserType {
  'boolean': boolean
  'string': string
  'number': number
}
