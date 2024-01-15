import winston, { Logger as WinstonLogger } from 'winston'
import logform from 'logform'

class Logger {
  private logger: WinstonLogger = winston.createLogger({
    format: logform.format.combine(
      logform.format.timestamp(),
      logform.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
      ),
    ),
    defaultMeta: { service: 'timers-timer' },
    transports: [new winston.transports.Console()],
  })

  private meta: any = { ...this.logger.defaultMeta }

  public log(message: any): void {
    this.logger.info(message, this.meta)
  }

  public error(message: any): void {
    this.logger.error(message, this.meta)
  }

  public warn(message: any): void {
    this.logger.warn(message, this.meta)
  }

  public debug(message: any): void {
    this.logger.debug(message, this.meta)
  }

  public verbose(message: any): void {
    this.logger.verbose(message, this.meta)
  }
}

export const logger = new Logger()
