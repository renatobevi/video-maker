const readline = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}

async function start() {
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    await robots.text(content)

    function askAndReturnSearchTerm() {
        //return 'TERM EXAMPLE'
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes)
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        //console.log(selectedPrefixIndex)
        //console.log(selectedPrefixText)
        return selectedPrefixText
    }

    console.log(content)
}

start()