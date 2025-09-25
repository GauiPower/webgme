import "buffer"
import { Buffer } from "buffer"
import { GmeFile } from "gmelib"

const audioTemplate = document.getElementById("audios-template")
const binaryTemplate = document.getElementById("binaries-template")

let reader = new FileReader()

let gmefile = null
let gmefilename = "newFile.gme"


// todo: audio upload | binaries up donw load switch gen | download gme
// todo: gmelib change second media table only if set | return empty array, so .forEach allwas works

const openGME = () => {
    openFile((buffer, filename) => {
        console.log("file", filename)
        gmefilename = filename
        gmefile = new GmeFile(buffer)

        gmefile.mediaSegments.forEach(generateAudioElement)

        document.getElementById("display").innerText = `Product Id: ${gmefile.productId} First used Oid: Last used Oid:`
        document.getElementById("product-id").value = gmefile.productId

        generateBinaries()
    })
}

const changeProductId = () => {
    const productId = document.getElementById("product-id").value
    gmefile.changeProductId(productId)
}

const clickAudio = (e) => {
    playAudio(gmefile.extractAudioFile(e.number))
}

const replaceBinary = (e) => {
    alert("not implemented")
    const gen = document.getElementById("processor-generation").value
    openFile((buffer) => {
        if (gen === "1") {
            gmefile.replaceBinary(buffer, gmefile.game1binariesTable, gmefile.game1binariesTableOffset, e.index)
        } else if (gen === "2n") {
            gmefile.replaceBinary(buffer, gmefile.game2NbinariesTable, gmefile.game2NbinariesTableOffset, e.index)
        } else if (gen === "3l") {
            gmefile.replaceBinary(buffer, gmefile.game3LbinariesTable, gmefile.game3LbinariesTableOffset, e.index)
        }
    })
}

const replaceAudio = (e) => {
    openFile((buffer) => {
        gmefile.changeSmartMedia(buffer, e.number)
    })
}


const downloadFile = (filename, buffer) => {
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const downloadAudio = (e) => {
    downloadFile(`audio_${e.number}`, gmefile.extractAudioFile(e.number))
}

const downloadBinary = (e) => {
    downloadFile(`${e.filename}`, gmefile.gmeFileBuffer.slice(e.offset, e.offset + e.size))
}

const generateAudioElement = (e) => {
    const clone = audioTemplate.content.cloneNode(true)

    clone.querySelector("[data-id=btn-play").onclick = clickAudio.bind(null, e)
    clone.querySelector("[data-id=btn-download]").onclick = downloadAudio.bind(null, e)
    clone.querySelector("[data-id=btn-replace]").onclick = replaceAudio.bind(null, e)
    clone.querySelector("[data-id=audios-text]").innerText = e.number

    const div = clone.querySelector("[data-id=buttontestdiv]")
    document.getElementById("audios").appendChild(div)

}

const generateBinaryElement = (e) => {
    const clone = binaryTemplate.content.cloneNode(true)

    clone.querySelector("[data-id=binary-name]").innerText = e.filename
    clone.querySelector("[data-id=btn-replace]").onclick = replaceBinary.bind(null, e)
    clone.querySelector("[data-id=btn-download]").onclick = downloadBinary.bind(null, e)


    const div = clone.querySelector("[data-id=binary-div]")
    document.getElementById("binaries").appendChild(div)
}


function openFile(callback) {
    const input = document.createElement("input");
    input.type = "file";
    let filename = "no_name"

    input.onchange = async (event) => {
        const file = event.target.files[0];
        filename = file.name
        if (!file) {
            console.log("no file selected")
            return;
        }
        reader.readAsArrayBuffer(file);
    }

    const reader = new FileReader();

    reader.onloadend = () => {
        console.log("Load end")
        const buffer = new Uint8Array(reader.result);
        callback(Buffer.from(buffer), filename);
    };

    reader.onerror = () => {
        alert("error reading file")
    };

    input.click();

}


const playAudio = (filebuffer) => {
    const blob = new Blob([filebuffer]);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
};

const downloadGME = () => {
    gmefile.writeMediaTable()
    downloadFile(`edited${gmefilename}`, gmefile.gmeFileBuffer)
}

const generateBinaries = () => {
    const gen = document.getElementById("processor-generation").value
    document.getElementById("binaries").innerHTML = ""
    if (gen === "1") {
        generateBinaryElement(gmefile.main1binaryTable[0])
        gmefile.game1binariesTable.forEach(generateBinaryElement)
    } else if (gen === "2n") {
        generateBinaryElement(gmefile.main2NbinaryTable[0])
        gmefile.game2NbinariesTable.forEach(generateBinaryElement)
    } else if (gen === "3l") {
        generateBinaryElement(gmefile.main3LbinaryTable[0])
        gmefile.game3LbinariesTable.forEach(generateBinaryElement)
    }
}

document.getElementById("product-id").onchange = changeProductId
document.getElementById("download-gme").onclick = downloadGME
document.getElementById("processor-generation").onchange = generateBinaries
document.getElementById("open-button").onclick = openGME