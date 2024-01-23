// eslint-disable-next-line no-restricted-imports
import colors from 'colors'

let startTime;

function formatAndLog(text, colorFn = colors.green) {
    console.log(colorFn(text ?? ''))
}

export function printIntro() {
    startTime = Date.now()
    formatAndLog('███████╗██╗██╗     ███████╗    ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ ██████╗ ██╗   ██╗')
    formatAndLog('██╔════╝██║██║     ██╔════╝    ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝')
    formatAndLog('█████╗  ██║██║     █████╗      █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║██████╔╝ ╚████╔╝')
    formatAndLog('██╔══╝  ██║██║     ██╔══╝      ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║██╔══██╗  ╚██╔╝')
    formatAndLog('██║     ██║███████╗███████╗    ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝██║  ██║   ██║')
    formatAndLog('╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝')

    formatAndLog('Welcome to File Foundry!', colors.green.bold)
    formatAndLog('Your ultimate solution for efficient file management and processing.')
    formatAndLog('Created by Colten Krauter', colors.italic)
    formatAndLog('Check out the project on GitHub: https://github.com/coltenkrauter/file-foundry-cli', colors.italic)
    console.log()
}

export function printOutro() {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log()
    formatAndLog(`Execution duration: ${formatDuration(duration)}`)
    formatAndLog(`Execution started: ${new Date(startTime).toLocaleString(undefined, { timeZoneName: 'short' })}`)
    formatAndLog(`Execution ended: ${new Date(endTime).toLocaleString(undefined, { timeZoneName: 'short' })}`)
    formatAndLog()
    formatAndLog(`END OF EXECUTION – ${'Thanks for using FILE FOUNDRY'} `)
    console.log()
}

export function printGracefulOutro() {
    console.log()
    console.log()
    console.log(colors.green.bold(`Detected Signal Interrupt – Exiting`))
    printOutro()
}

function formatDuration(duration) {
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    const hoursDisplay = hours > 0 ? `${hours}h ` : ''
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : ''
    const secondsDisplay = `${seconds}s`

    return hoursDisplay + minutesDisplay + secondsDisplay
}

export function setLogLevel() {
    const commandLine = process.argv.join(' ')
    const lowercaseCommandLine = commandLine.toLowerCase()
    const sanitizedCommandLine = lowercaseCommandLine.replaceAll(/\s+/g, ' ')

    if (sanitizedCommandLine.includes('-l super-debug') || sanitizedCommandLine.includes('--log-level super-debug')) {
        console.log('Running in SUPER-DEBUG mode (Like debug but with underlying debug logs)')
        console.log()
        process.env.DEBUG = '*'
    }
}