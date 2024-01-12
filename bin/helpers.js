import colors from 'colors'

const indent = '        '

export function printIntro() {
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
    console.log()
    console.log(colors.green.bold(`${indent}END OF FILE FOUNDRY EXECUTION`))
    console.log()
}
