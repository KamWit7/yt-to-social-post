// Console backup interface
interface ConsoleBackup {
  log: typeof console.log
  error: typeof console.error
}

let consoleBackup: ConsoleBackup | null = null

export const setupConsoleControl = () => {
  consoleBackup = {
    log: console.log,
    error: console.error,
  }

  const shouldLog = process.env.VERBOSE_TESTS === 'true'

  console.log = (...args: Parameters<typeof console.log>) => {
    if (shouldLog) consoleBackup!.log(...args)
  }

  console.error = (...args: Parameters<typeof console.error>) => {
    if (shouldLog) consoleBackup!.error(...args)
  }
}

export const restoreConsole = () => {
  if (consoleBackup) {
    console.log = consoleBackup.log
    console.error = consoleBackup.error
    consoleBackup = null
  }
}
