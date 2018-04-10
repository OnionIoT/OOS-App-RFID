
function makeId () {
  return Math.random().toString(36).substring(2)
}

export default {
  name: 'ConsoleSDK',
  appUid: '',
  makeId: makeId,
  init: function () {
    window.addEventListener('message', this.processMessage.bind(this), false)
  },
  subscribe: function (topic, callback) {
    this.sendEvent('Onion.CDK.subscribe', {topic: topic})
  },
  publish: function (topic, content) {

  },
  service: function (name, command, callback) {
    this.sendEvent('Onion.CDK.service', {
      service: name,
      command: command
    })
  },
  // createService: function (name) {
  //   // var serviceStatus = 'stopped'
  //   // TODO: init iframe call go get service status
  //   return {
  //     status (callback) {
  //       // this.service
  //     },
  //     start () {
  //
  //     },
  //     stop () {
  //
  //     }
  //   }
  // },
  sendEvent: function (event, content) {
    var eventId = makeId()
    window.parent.postMessage({
      event: event,
      instance: this.appUid,
      eventId: eventId,
      content: content
    }, '*')
    return eventId
  },
  sendCmd: function (command) {

  },
  processMessage: function (e) {
    console.log(e)
    if (e.data.event === 'Onion.CDK.Init') {
      var appUid = e.data.appUid
      this.appUid = appUid
      this.onInit()
    } else if (e.data.event === 'Onion.CDK.Service') {
      this.onService(
        e.data.content.name,
        e.data.content.command,
        e.data.content.result)
    // } else if (e.data.event === 'Onion.CDK.Message') {
    //   this.handlers.Service (
    //     e.data.content.topic,
    //     e.data.content.content )
    // } else if (e.data.event === 'Onion.CDK.Cmd') {
    //   this.handlers.Cmd (
    //     e.data.content.cmd,
    //     e.data.content.response )
    }
  },
  onInit () {},
  onService (name, command, result) {},
  onMessage () {},
  onCmd () {}
}
