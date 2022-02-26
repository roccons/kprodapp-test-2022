// From https://ourcodeworld.com/articles/read/257/how-to-get-the-client-ip-address-with-javascript-only
/**
 * Get the user IP throught the webkitRTCPeerConnection.
 * @param {Function} onNewIP listener function to expose the IP locally
 * @returns {void}
 */
module.exports = function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
  //compatibility for firefox and chrome
  const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  const localIPs = {}
  let called = false

  const iterateIP = ip => {
    if (!localIPs[ip]) onNewIP(ip)
    localIPs[ip] = called = true
  }
  if (!PeerConnection) {
    iterateIP('127.0.0,1')
  }

  const pc = new PeerConnection({
    iceServers: []
  })
  const noop = () => {}
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

  // create a bogus data channel
  pc.createDataChannel('')

  // create offer and set local description
  pc.createOffer().then(sdp => {
    sdp.sdp.split('\n').forEach(line => {
      if (line.indexOf('candidate') < 0) return
      line.match(ipRegex).forEach(iterateIP)
    })
    pc.setLocalDescription(sdp, noop, noop)
  }).catch(() => {
    // An error occurred, so handle the failure to connect
    if (!called) iterateIP('127.0.0.1')
  })

  //listen for candidate events
  pc.onicecandidate = ice => {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}
