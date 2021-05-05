onmessage = e => {
    let a1 = e.data.text1
    let a2 = e.data.text2

    if (a1 === null || a2 === null) {
        return postMessage(`<span style="color: #e06c6c"> Error: dot, question mark or exclamation mark characters must be used at the end of a sentence. </span>`)
    }

    let arr1 = a1.map(array => array.trim())
    let arr2 = a2.map(array => array.trim())

    const cache = [...Array(arr1.length)].map(() => Array(arr2.length))
    const common = subsequence(arr1, arr2, 0, 0, cache)
    let result = diff(arr1, arr2, common.match(/.*?[?!.]/g))

    function diff(left,right, common) {
        let long_counter = 0
        let short_counter = 0
        let common_counter = 0
        let short_temp = []
        let long_temp = []
        const result = []

        if (common === null) {
            return (`<span style="color: #e06c6c"> Error: There is nothing in common </span>`)
        }

        common = common.map(s => s.trim())

        const long = left.length > right.length ? left : right
        const short = left.length > right.length ? right : left

        while (short_counter < short.length) {
            if (short[short_counter] === common[common_counter]) {
                if (long[long_counter] === common[common_counter]) {
                    long_counter++
                }
                else if (long[long_counter] !== common[common_counter]) {
                    while (long[long_counter] !== common[common_counter]) {
                        result.push(`<span style="color: #64b5f6"> ${long[long_counter]} </span>`)
                        long_counter++
                    }
                }
                result.push(short[short_counter])
                common_counter++
                short_counter++
            }
            else if (long[long_counter] !== common[common_counter]) {
                while (short[short_counter] !== common[common_counter] && long[long_counter] !== common[common_counter]) {
                    while (short[short_counter] !== common[common_counter]) {
                        short_temp.push(short[short_counter])
                        short_counter++
                    }
                    while (long[long_counter] !== common[common_counter]) {
                        long_temp.push(long[long_counter])
                        long_counter++
                    }
                }
                let temporary = wordSubsequence(short_temp, long_temp)
                result.push(temporary)
                temporary = []
                short_temp = []
                long_temp = []
            }
            else if (long[long_counter] === common[common_counter]) {
                result.push(`<span style="color: #ffb74d"> ${short[short_counter]} </span>`)
                short_counter++
            }

        }

        while (long_counter < long.length) {
            result.push(`<span style="color: #64b5f6"> ${long[long_counter]} </span>`)
            long_counter++
        }

        return result.join(' ')
    }

    postMessage(result)
}

function subsequence(arr1, arr2, i, j, cache) {
    if (arr1.length === i || arr2.length === j) {
        return ''
    }
    if (cache[i][j]) {
        return cache[i][j]
    }
    if (arr1[i] === arr2[j]) {
        cache[i][j] = arr1[i] + ' ' + subsequence(arr1, arr2, i + 1, j + 1, cache)
    } else {
        const next1 = subsequence(arr1, arr2, i + 1, j, cache)
        const next2 = subsequence(arr1, arr2, i, j + 1, cache)

        cache[i][j] = (next1.length > next2.length) ? next1 : next2
    }

    return cache[i][j]
}

function wordSubsequence(short, long) {
    short = short.join(' ').split(' ')
    long = long.join(' ').split(' ')

    const word_cache = [...Array(short.length)].map(() => Array(long.length))
    const word_common = subsequence(short, long, 0, 0, word_cache)

    function diff(short, long, common) {
        let long_counter = 0
        let common_counter = 0
        const result = []
        common.pop()

        for (let short_counter = 0; short_counter < short.length; short_counter++) {
            if (short[short_counter] === common[common_counter]) {
                if (long[long_counter] === common[common_counter]) {
                    long_counter++
                }
                else if (long[long_counter] !== common[common_counter]) {
                    while (long[long_counter] !== common[common_counter]) {
                        result.push(`<span style="color: #64b5f6"> ${long[long_counter]} </span>`)
                        long_counter++
                    }
                    long_counter++
                }
                result.push(short[short_counter])
                common_counter++
            }
            else {
                result.push(`<span style="color: #ffb74d"> ${short[short_counter]} </span>`)
            }
        }

        while (long_counter < long.length) {
            result.push(`<span style="color: #64b5f6"> ${long[long_counter]} </span>`)
            long_counter++
        }

        return result.join(' ')
    }

    let result = diff(short, long, word_common.split(' '))
    return result
}