import "buffer"
import { Buffer } from "buffer"
import { GmeFile } from "gmelib"
let reader = new FileReader()

let gmefile = null

const newfile = () => {
    alert("hi")
}

// todo: audio upload| file download | binaries up donw load

document.getElementById("inputfile").addEventListener("change", (e) => {
    reader.readAsArrayBuffer(e.target.files[0])
})

const changeProductId = (e) => {
    const productId = document.getElementById("product-id").value
    console.log(productId)
    gmefile.changeProductId(productId)
}

const clickAudio = (e) => {
    console.log("click ich bin ", e)
    playAudio(gmefile.extractAudioFile(e.number))
}

const replaceAudio = (e) => {
    console.log(e)
}

const downloadAudio = (e) => {
    const blob = new Blob([gmefile.extractAudioFile(e.number)]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audio_${e.number}`; // Set the file name for the download
    document.body.appendChild(a); // Append the anchor to the DOM
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the anchor after download
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(url);
}
const audioTemplate = document.getElementById("audios-template")
const binaryTemplate = document.getElementById("binaries-template")

const generateAudioElement = (e) => {
    const clone = audioTemplate.content.cloneNode(true)
    // const button = clone.querySelector("[data-id=buttontest]")
    const div = clone.querySelector('[data-id=buttontestdiv]')
    const playBtn = clone.querySelector('[data-id=play-button]')
    playBtn.onclick = clickAudio.bind(null, e)
    const downloadBtn = clone.querySelector('[data-id=btn-download]')
    downloadBtn.onclick = downloadAudio.bind(null, e)
    const teext = clone.querySelector('[data-id="audios-text"]')
    
    teext.innerText = e.number
    
    document.getElementById("audios").appendChild(div)

}

const generateBinaryElement = (e) => {
    console.log(e)
    const clone = binaryTemplate.content.cloneNode(true)
    const div = clone.querySelector("[data-id=binary-div]")
    clone.querySelector("[data-id=binary-name]").innerText = e.filename
    document.getElementById("binaries").appendChild(div)
    // const div = document.createElement("div")
    // div.className = "binary-element"
    // div.innerText = `Binary: ${e.filename}`
    // // div.onclick 
    // document.getElementById("binaries").appendChild(div)
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
    alert(1)
}

document.getElementById("product-id").onchange = changeProductId
document.getElementById("download-gme").onclick = downloadGME