<template>
  <div class="container">
    <div class="modal" :class="modalActive" id="modal-id" style="background-color: white; opacity: 0.5">
      <div class="loading loading-lg"></div>
    </div>
    <div class="columns">
      <div class="column topbar">
        <div class="navbar">
          <section class="navbar-section">
            <div class="navbar-brand mr-2">RFID Reader</div>
          </section>
          <section class="navbar-section">
            <button class="btn btn-primary btn-sm mr-2" v-on:click="toggleScan">{{buttonMsg}}</button>
            <button class="btn btn-primary btn-sm" v-on:click="clearList">Clear List</button>
          </section>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column col-6 col-xs-12 col-s-12">
        <img src="~@/assets/rfid-nfc-expansion.png" class="centered img-responsive">
      </div>
      <div class="column col-6 col-xs-12 col-s-12">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>UID</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cards" :key="item.uid+item.time">
              <td>{{item.uid}}</td>
              <td>{{item.time}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <!--<button class="btn btn-primary" v-on:click="addCard">Add Card</button>-->
      <h5>{{instructions}}</h5>
    </div>
  </div>
</template>

<script>
import OnionCDK from '@/OnionCDK.js'
export default {
  name: 'RfidExp',
  components: {
    OnionCDK
  },
  data () {
    return {
      bReady: false,
      bScanEnabled: false,
      cards: [],
      lastUid: '',
      lastAccess: new Date(),
      service: 'rfid-scan',
      topic: '/console/rfid',
      appUid: ''
    }
  },
  methods: {
    addCard: function (uid) {
      var now = new Date()
      var timeStamp = now.toUTCString()
      if (this.lastUid !== uid || (now - this.lastAccess) > 1600) {
        this.cards.unshift({
          uid: uid,
          time: timeStamp
        })
        this.lastUid = uid
        this.lastAccess = now
      }
    },
    clearList: function () {
      this.cards = []
    },
    toggleScan: function () {
      if (this.bScanEnabled) {
        // currently enabled - send command to STOP scan process
        OnionCDK.service(this.service, 'stop')
      } else {
        // currently disabled - send command to START scan process
        OnionCDK.service(this.service, 'start')
      }
    }
  },
  computed: {
    buttonMsg: function () {
      return (this.bScanEnabled ? 'Stop Scanning' : 'Start Scanning')
    },
    instructions: function () {
      if (!this.bScanEnabled) {
        return 'Hit the Start Scanning button above!'
      } else if (this.cards.length === 0) {
        return 'Bring an RFID tag close to your Expansion!'
      } else {
        return ''
      }
    },
    modalActive: function () {
      if (!this.bReady) {
        return 'active'
      } else {
        return ''
      }
    }
  },
  created: function () {
    OnionCDK.onInit = function () {
      console.log('initialized')
      OnionCDK.service('rfid-scan', 'list')
      OnionCDK.subscribe(this.topic)
    }.bind(this)

    // Onion.CDK.onMessage;
    OnionCDK.onService = function (name, command, result) {
      console.log(name, command, result)
      if (command === 'list' && typeof result !== 'undefined') {
        // console.log('list: setting bScanEnabled to ' + result)
        this.bScanEnabled = result
        this.bReady = true
      } else if (command === 'start' && typeof result !== 'undefined') {
        // console.log('start: setting bScanEnabled to ' + result)
        this.bScanEnabled = result
      } else if (command === 'stop' && typeof result !== 'undefined') {
        // console.log('stop: setting bScanEnabled to ' + result)
        this.bScanEnabled = !result
      }
    }.bind(this)

    OnionCDK.onMessage = function (topic, content) {
      var data = JSON.parse(content)
      if (topic === this.topic) {
        if (data.tag) {
          this.addCard(data.tag)
        }
      }
    }.bind(this)

    OnionCDK.init()
  }
}
</script>

<style>
.topbar {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  background-color: #F5D76E;
}
</style>
