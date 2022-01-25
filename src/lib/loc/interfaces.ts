export interface Args {
  readonly cwd: string
  readonly paths?: string[]
  readonly yes?: boolean
  readonly log?: 'y' | 'n'
}

export interface Count {
  c: number
}
