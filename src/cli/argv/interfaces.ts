export interface Argv {
  readonly cwd: string
  readonly yes?: boolean
  readonly log?: 'y' | 'n'
  readonly paths?: string[]
}
