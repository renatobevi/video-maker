const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    //console.log('Recebi com sucesso o content: ${content.searchTerm}')

    //console.log('Logando se a função "fetchContentFromWikipedia" retorna uma Promise')
    //console.log(fetchContentFromWikipedia())

    async function fetchContentFromWikipedia(content) {
        //return 'RESULTADO DA PROMISE'

        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
        //console.log('Fazendo log do objeto "wikipediaResponde"')
        //console.log(wikipediaResponde)
        const wikipediContent = wikipediaResponde.get()
        //console.log(wikipediContent)
        content.sourceContentOriginal = wikipediContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParentheses

        //console.log(withoutDatesInParentheses)

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }

                return true
            })

            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }

    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }

    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        //console.log(sentences)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    /*function sanitizeContent(content) {
        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal)
        const withoutMarkdown = removeMarkdown(withoutBlankLines)
        //console.log(withoutBlankLines)
        console.log(withoutMarkdown)

        function removeBlankLines(text) {
            const allLines = text.split('\n')
            //console.log(allLines)

            const withoutBlankLines = allLines.filter((line) => {
                if (line.trim().length === 0) {
                    return false
                }

                return true
            })

            return withoutBlankLines
        }
    }
    */

    /*
     function removeMarkdown(lines) {
         const withoutMarkdown = lines.filter((line) => {
             if (line.trim().startsWith('=')) {
                 return false
             }
             return true
         })
 
         return withoutMarkdown
     }
     */
}

module.exports = robot