let offer /* offer JSON object */

const rc = new RTCPeerConnection()

rc.onicecandidate = _ => console.log("New ICE candidate! reprinting SDP:" + JSON.stringify(rc.localDescription))

rc.ondatachannel = e => {
    rc.dc = e.channel
    rc.dc.onmessage = e => console.log("Just got a message " + e.data)
    rc.dc.onopen = _ => console.log("Connection opened!")
}

rc.setRemoteDescription(offer).then(_ => console.log("offer set"))

rc.createAnswer().then(a => rc.setLocalDescription(a)).then(_ => console.log("answer created"))

// GOTO 1.js

rc.dc.send("To peer A")
