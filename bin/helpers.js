import colors from 'colors'

const indent = '        '
let startTime;

export function printIntro() {
    startTime = Date.now()
    console.log(colors.green(`
${indent}███████╗██╗██╗     ███████╗    ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ ██████╗ ██╗   ██╗
${indent}██╔════╝██║██║     ██╔════╝    ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
${indent}█████╗  ██║██║     █████╗      █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║██████╔╝ ╚████╔╝ 
${indent}██╔══╝  ██║██║     ██╔══╝      ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║██╔══██╗  ╚██╔╝  
${indent}██║     ██║███████╗███████╗    ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝██║  ██║   ██║   
${indent}╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   
    `))
    console.log(colors.green.bold(`${indent}Welcome to File Foundry!`))
    console.log(colors.green(`${indent}Your ultimate solution for efficient file management and processing.`))
    console.log(colors.italic(`${indent}Created by Colten Krauter`))
    console.log(colors.italic(`${indent}Check out the project on GitHub: https://github.com/coltenkrauter/file-foundry-cli`))
    console.log()
}

export function printOutro() {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log()
    console.log(colors.green(`${indent}Execution Time: ${formatDuration(duration)}`))
    console.log(colors.green(`${indent}Execution started at: ${new Date(startTime).toLocaleString(undefined, { timeZoneName: 'short' })}`))
    console.log(colors.green(`${indent}Execution ended at: ${new Date(endTime).toLocaleString(undefined, { timeZoneName: 'short' })}`))
    console.log()
    console.log(colors.green(`${indent}END OF EXECUTION – ${colors.bold('Thanks for using FILE FOUNDRY')} `))
    console.log()
}

export function printGracefulOutro() {
    console.log()
    console.log()
    console.log(colors.green.bold(`${indent}Detected Signal Interrupt – Exiting`))
    printOutro()
}

function formatDuration(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hoursDisplay = hours > 0 ? `${hours}h ` : '';
    const minutesDisplay = minutes > 0 ? `${minutes}m ` : '';
    const secondsDisplay = `${seconds}s`;

    return hoursDisplay + minutesDisplay + secondsDisplay;
}
