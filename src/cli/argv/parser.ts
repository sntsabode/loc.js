/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { nil, unsafe } from '../../lib/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
export default class ArgParser<Argv extends { }> {
  constructor(
    private pargs = process.argv
  ) { }

  private args: ArgParserArg<Argv>[] = []
  private i = 0
  private argv_obj = { } as Argv

  get staged_args(): Argv { return this.argv_obj }

  arg<T extends keyof Argv>(arg: T, options: ArgParserOption<Argv>): ArgParser<Argv> {
    this.args.push({ arg: arg as string, ...options })
    return this
  }

  insert<T extends keyof Argv>(arg: T, val: Argv[T]): ArgParser<Argv> {
    this.argv_obj[arg] = val
    return this
  }

  get argv(): Argv {
    while (this.i < this.pargs.length) {
      this.processArg(this.pargs[this.i]!)
      this.i++
    }

    return this.argv_obj
  }

  private processArg(arg: string) {
    if (/(?<!-)-[\w+]{2,}/.test(arg)) {
      this.processMultiArg(arg)
      return
    }

    const a = this.args.find(
      a => (!!a.alias && a.alias === arg.substring(1))
        || a.arg === arg.substring(2)
    )
    if (!a) { return }

    this.matchArg(a)
  }

  private processMultiArg(arg: string) {
    let c: string
    let a: nil<ArgParserArg<Argv>>
    for (let i = 1; i < arg.length; i++) {
      c = arg.charAt(i)
      a = this.args.find(
        a => !!a.alias && a.alias === c
      )
      if (!a) { return }

      this.matchArg(a)
    }
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
        (this.argv_obj as unsafe)[arg.arg] = true; break
    }
  }

  private processLookAhead(arg: ArgParserArg<Argv>) {
    this.i++
    const a = arg.sanitizer
      ? arg.sanitizer(this.pargs[this.i]!, this)
      : this.pargs[this.i]

    if (arg.choices) {
      const i = arg.choices.findIndex(c => c === a)
      if (i === -1) {
        throw new Error(`Expected ${arg.choices.join(' || ')} found ${a}`)
      }
    }

    (this.argv_obj as unsafe)[arg.arg] = a
  }

  private processArray(arg: ArgParserArg<Argv>) {
    (this.argv_obj as unsafe)[arg.arg] = []
    this.i++

    while (this.i < this.pargs.length) {
      const a = this.pargs[this.i]!

      if ( // Fix this mess
        /(?<!-)-[\w+]{2,}/.test(a)
        || /-[\w](?!\w)/.test(a)
        || /--[\w]+/.test(a)
      ) { this.i--; break }

      (this.argv_obj as unsafe)[arg.arg].push(
        arg.sanitizer ? arg.sanitizer(a, this) : a
      )

      this.i++
    }
  }
}

export type ArgParserArg<T> = ArgParserOption<T> & { arg: string }

export interface ArgParserOption<T> {
  alias?: string
  type: keyof ArgParserType
  describe?: string
  default?: ArgParserType
  choices?: string[]
  sanitizer?: (v: string, sup: ArgParser<T>) => ArgParserType[keyof ArgParserType]
}

export interface ArgParserType {
  'boolean': boolean
  'string': string
  'number': number
  'array': string[]
}
