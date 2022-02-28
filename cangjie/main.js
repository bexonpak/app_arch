var chsSplitSize = (inputstr, size) => {
    var inarr = inputstr.split(""), strcurr, strnext, asccurr, ascnext, posonebase = 0, lastzerobase = 0, chsnext = false, i, j, k = 0, ou = [], s
    inarr.push("")
    for (i = 0; i < inarr.length - 1; i++) {
        strcurr = inarr[i]; strnext = inarr[i + 1]
        try {
            asccurr = strcurr.charCodeAt(0)
            ascnext = strnext.charCodeAt(0)
        } catch (e) { }
        if (asccurr > 255) {
            posonebase += 2
        } else {
            posonebase++
        }
        if (ascnext > 255) {
            chsnext = true
        } else {
            chsnext = false
        }
        if (chsnext && (posonebase - lastzerobase) == (size - 1)) {
            s = ""
            for (j = k; j <= i; j++) {
                s += inarr[j]
            }
            k = i + 1
            lastzerobase = posonebase
            if (s.length > 0) ou.push(s)
        } else if ((posonebase - lastzerobase) == size) {
            s = ""
            for (j = k; j <= i; j++) {
                s += inarr[j]
            }
            k = i + 1
            lastzerobase = posonebase
            if (s.length > 0) ou.push(s)
        }
    }
    if ((posonebase - lastzerobase) <= size) {
        s = ""
        for (j = k; j <= i; j++) {
            s += inarr[j]
        }
        k = i + 1
        lastzerobase = posonebase
        if (s.length > 0) ou.push(s)
    }
    return ou
}

function toHanCode(code) {
    let hanCode = ''
    const hanCodeJson = {
        "q": "手", "w": "田", "e": "水", "r": "口", "t": "廿", "y": "卜", "u": "山", "i": "戈",
        "o": "人", "p": "心", "a": "日", "s": "尸", "d": "木", "f": "火",
        "g": "土", "h": "竹", "j": "十", "k": "大", "l": "中", "z": "重",
        "x": "难", "c": "金", "v": "女", "b": "月", "n": "弓", "m": "一"
    }
    let codeArr = code.split('')
    codeArr.forEach(c => {
        hanCode = hanCode + hanCodeJson[c]
    })
    return hanCode
}


window.onload = () => {
    cj = {}
    big5 = {}
    list = []

    var isHan = /[^\u4e00-\u9fa5]/
    axios.get('./cj.json')
        .then(response => {
            cj = response.data
        })
        .catch(error => {
            console.log(error)
        })
    axios.get('./big5_unicode.json')
        .then(response => {
            big5 = response.data
        })
        .catch(error => {
            console.log(error)
        })

    var vm = new Vue({
        el: '#content',
        data: {
            list: list
        },
        methods: {
            search(e) {
                let arr = chsSplitSize(e.currentTarget.value, 2)
                arr = arr.filter(han => han != ' ').filter(han => !han.match(isHan))
                if (arr.length != 0) {
                    list.length = 0
                    arr.forEach(v => {
                        let item = {}
                        item['han'] = v
                        if (big5[v] != undefined) {
                            item['big5'] = 'http://input.foruto.com/cjdict/Images/CJZD_JPG/' + big5[v] + '.JPG'
                        }
                        item['code'] = cj[v].toUpperCase()
                        item['hcode'] = toHanCode(cj[v])
                        list.push(item)
                    })
                }
            },
            pic(url) {
                document.getElementById('alert').style.setProperty('--show-chai-zi', 'block')
                document.getElementById('chai-img').setAttribute('src', url)
            },
            dimiss() {
                document.getElementById('alert').style.setProperty('--show-chai-zi', 'none')
                document.getElementById('chai-img').removeAttribute('src')
            },
            mf(han) {
                let urlMF = "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=" + han
                document.getElementById('alertMF').style.setProperty('--show-mfcc', 'block')
                document.getElementById('mfcc').setAttribute('src', urlMF)
            },
            dimissMF() {
                document.getElementById('alertMF').style.setProperty('--show-mfcc', 'none')
                document.getElementById('mfcc').removeAttribute('src')
            }
        }
    })



}