import "buffer"
import { Buffer } from "buffer"
import { GmeFile } from "gmelib"

const audioTemplate = document.getElementById("audios-template")
const binaryTemplate = document.getElementById("binaries-template")

let reader = new FileReader()

let gmefile = null
let filename = "newFile.gme"


// todo: audio upload | binaries up donw load switch gen | download gme

document.getElementById("inputfile").addEventListener("change", (e) => {
    filename = e.target.files[0].name
    reader.readAsArrayBuffer(e.target.files[0])
})

const changeProductId = (e) => {
    const productId = document.getElementById("product-id").value
    gmefile.changeProductId(productId)
}

const clickAudio = (e) => {
    playAudio(gmefile.extractAudioFile(e.number))
}

const replaceAudio = (e) => {
    console.log(e)
}

const downloadAudio = (e) => {
    downloadFile(`audio_${e.number}`, gmefile.extractAudioFile(e.number))
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

const generateAudioElement = (e) => {
    const clone = audioTemplate.content.cloneNode(true)
    
    clone.querySelector("[data-id=btn-play").onclick = clickAudio.bind(null, e)
    clone.querySelector("[data-id=btn-download]").onclick = downloadAudio.bind(null, e)
    clone.querySelector("[data-id=audios-text]").innerText = e.number
    
    const div = clone.querySelector("[data-id=buttontestdiv]")
    document.getElementById("audios").appendChild(div)

}

const generateBinaryElement = (e) => {
    const clone = binaryTemplate.content.cloneNode(true)
    
    clone.querySelector("[data-id=binary-name]").innerText = e.filename
    
    const div = clone.querySelector("[data-id=binary-div]")
    document.getElementById("binaries").appendChild(div)
}

reader.onloadend = (e) => {
    gmefile = new GmeFile(Buffer.from(new Int8Array(e.target.result)))
    
    gmefile.mediaSegments.forEach(generateAudioElement)
    
    document.getElementById("display").innerText = `Product Id: ${gmefile.productId} First used Oid: Last used Oid:`
    document.getElementById("product-id").value = gmefile.productId
    
    generateBinaryElement(gmefile.main3LbinaryTable[0])
    gmefile.game3LbinariesTable.forEach(generateBinaryElement)
}

const playAudio = (filebuffer) => {
    const blob = new Blob([filebuffer]);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
};

const downloadGME = () => {
    downloadFile(`edited${filename}`, gmefile.gmeFileBuffer)
}

document.getElementById("product-id").onchange = changeProductId
document.getElementById("download-gme").onclick = downloadGME