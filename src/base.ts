import {Command, Flags, Interfaces} from '@oclif/core'
import {Logger} from 'winston'

import {LogMessages, formatArgsAndFlags} from './utils/index.js'
import {LogLevel} from './utils/interfaces.js'
import {initializeLogger} from './utils/logger.js'
import {getRunId} from './utils/uuid.js'

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'log-level': Flags.custom<LogLevel>({
      char: 'l',
      default: LogLevel.info,
      description: 'Specify the log level',
      helpGroup: 'GLOBAL',
      options: Object.values(LogLevel),
    })(),
  }

  static enableJsonFlag = true

  protected args!: Args<T>

  protected flags!: Flags<T>
  protected logger!: Logger
  protected runId = getRunId()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    this.logger.debug(`${LogMessages.RunError} [${this.runId}]`)
    return super.catch(err)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async finally(_: Error | undefined): Promise<any> {
    this.logger.debug(`${LogMessages.RunEnd} [${this.runId}]`)
    return super.finally(_)
  }

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.logger = initializeLogger(flags['log-level'], this.runId)
    this.logger.debug(`${LogMessages.RunStart} [${this.runId}]`)
    this.logger.debug(`COMMAND: ${formatArgsAndFlags('ff', args, flags)}`)
    this.args = args as Args<T>
    this.flags = flags as Flags<T>
  }
}
