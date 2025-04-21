const lc = new RTCPeerConnection()

const dc = lc.createDataChannel("channel")

dc.onmessage = e => console.log("Just got a message " + e.data)

dc.onopen = _ => console.log("Connection opened!")

lc.onicecandidate = _ => console.log("New ICE candidate! reprinting SDP:" + JSON.stringify(lc.localDescription))

lc.createOffer().then(o => lc.setLocalDescription(o)).then(_ => console.log("Set successfully"))

// GOTO: 2.js

let answer /*answer JSON object*/

lc.setRemoteDescription(answer)

dc.send("To peer B")

// lc.addTrack() // using stream (videostream or audiostream)
