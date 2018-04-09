
function makeId () {
  return Math.random().toString(36).substring(2)
}

export default {
  name: 'ConsoleSDK',
  uuid: makeId(),
  makeId: makeId,
  init: function () {
    this.sendEvent('Onion.CDK.initialized', {})
  },
  subscribe: function (topic, callback) {
    this.sendEvent('Onion.CDK.subscribe', {topic: topic})
  },
  publish: function (topic, content) {

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

  }

}
