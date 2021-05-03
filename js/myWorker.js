onmessage = e => {
    let arr1 = e.data.text1
    let arr2 = e.data.text2

    const cache = [...Array(arr1.length)].map(() => Array(arr2.length))
    const common = subsequence(arr1, arr2, 0, 0, cache)

    function diff(left,right, common) {
        let x = 0;
        const result = [];
        common.pop()

        const long = left.length > right.length ? left : right
        const short = left.length > right.length ? right : left

        for (let i = 0, j = 0; i < short.length; i++) {
            if (short[i] === common[j]) {
                if (long[x] === common[j]) {
                    x++;
                }
                else if (long[x] !== common[j]) {
                    while (long[x] !== common[j]) {
                        result.push(`<span style="color: #64b5f6">` + long[x] + '</span>');
                        x++
                    }
                    x++
                }
                result.push(short[i]);
                j++;
            }
            else {
                result.push(`<span style="color: #ffb74d">` + short[i] + '</span>');
            }
        }

        while (x < long.length) {
            result.push(`<span style="color: #64b5f6">` + long[x] + '</span>');
            x++
        }

        return result.join(' ');
    }

    let result = diff(arr1, arr2, common.split(' '))

    this.postMessage(result)
}

function subsequence(arr1, arr2, i, j, cache) {
    if (arr1.length === i || arr2.length === j) {
        return '';
    }
    if (cache[i][j]) {
        return cache[i][j];
    }
    if (arr1[i] === arr2[j]) {
        cache[i][j] = arr1[i] + ' ' + subsequence(arr1, arr2, i + 1, j + 1, cache);
    } else {
        const next1 = subsequence(arr1, arr2, i + 1, j, cache);
        const next2 = subsequence(arr1, arr2, i, j + 1, cache);

        cache[i][j] = (next1.length > next2.length) ? next1 : next2;
    }
    return cache[i][j];
}