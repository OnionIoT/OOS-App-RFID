
function makeId () {
  return Math.random().toString(36).substring(2)
}

export default {
  name: 'ConsoleSDK',
  uuid: makeId(),
  makeId: makeId,
  init: function (callback) {
    // this.sendEvent('Onion.CDK.initialized', {})
    // TODO: translate callback to promisse 
    window.addEventListener('message', function (e) {
      console.log(e)
      console.log(this)
      this.processMessage(e, callback)
    }.bind(this), false)
  },
  subscribe: function (topic, callback) {
    this.sendEvent('Onion.CDK.subscribe', {topic: topic})
  },
  publish: function (topic, content) {

  },
  service: function (name, command) {
    this.sendEvent('Onion.CDK.service', {
      service: name,
      command: command
    })
  },
  sendEvent: function (event, content) {
    // var eventId = this.makeId()
    // // if ( callback ) {
    // //   OnionCloud.rpcHandlers[eventId] = callback;
    // // }
    window.parent.postMessage({
      event: event,
      instance: this.uuid,
      eventId: makeId(),
      content: content
    }, '*')
  },
  sendCmd: function (command) {

  },
  processMessage: function (e, callback) {
    if (e.data.event === 'Onion.CDK.AppInit') {
      this.appUid = e.data.appUid
      if (typeof callback === 'function')
        callback('alldone')
    }
  }

}
