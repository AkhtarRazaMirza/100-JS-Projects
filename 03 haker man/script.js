const randomdelay = () => {
    return new Promise((resolve) => {
        let timeout = 1 + 6 * Math.random();
        setTimeout(() => {
            resolve();
        }, timeout * 500);
    })
}

const additom = async (itom) => {
    await randomdelay()
    let div = document.createElement("div")
    div.innerHTML = itom
    document.body.append(div)
}

async function main() {
    let t = setInterval(() => {
        let last = document.body.getElementsByTagName("div")
        last = last[last.length - 1]
        if (last.innerHTML.endsWith("...")) {
            last.innerHTML = last.innerHTML.slice(0, last.innerHTML.length - 3)
        }
        else {
            last.innerHTML = last.innerHTML + "."
        }
    }, 400);

    let text = [
        "initializimg hacking",
        "reading your fils",
        "passward files detected",
        "sending all passwards and persanl fils to server...",
        "cleaning up",
    ]

    for (const itom of text) {
        await additom(itom)
    }

    await randomdelay()
    clearInterval(t)

}

main()