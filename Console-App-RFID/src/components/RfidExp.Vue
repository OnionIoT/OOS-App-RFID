<template>
  <div class="container">
    {{appUid}}
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
            <tr v-for="item in cards" :key="item.uid">
              <td>{{item.uid}}</td>
              <td>{{item.time}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <button class="btn btn-primary" v-on:click="addCard">Add Card</button>
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
      bScanEnabled: false,
      cards: [],
      service: 'rfid-scan',
      appUid: ''
    }
  },
  methods: {
    addCard: function (uid) {
      var now = new Date()
      var timeStamp = now.toUTCString()
      this.cards.unshift({
        uid: OnionCDK.makeId(),
        time: timeStamp
      })

      // OnionCDK.init()
      OnionCDK.subscribe('/test', console.log)
    },
    clearList: function () {
      this.cards = []
    },
    toggleScan: function () {
      this.bScanEnabled = !this.bScanEnabled
      if (this.bScanEnabled) {
        // send command to START scan process
        OnionCDK.service(this.service, 'start')
      } else {
        // send command to STOP scan process
        OnionCDK.service(this.service, 'stop')
      }
    }
  },
  computed: {
    buttonMsg: function () {
      return (this.bScanEnabled ? 'Stop Scanning' : 'Start Scanning')
    }
  },
  created: function () {
    OnionCDK.onInit = function () {
      console.log('initialized')
      OnionCDK.service('rfid-scan', 'list')
    }

    // Onion.CDK.onMessage;
    OnionCDK.onService = function (name, command, result) {
      console.log(name, command, result)
    }

    OnionCDK.init()
    // OnionCDK.service('rfid-scan', 'list')
    //   .then(result => {
    //     console.log(result)
    //   })
    //   // .then(function () {
    //   //   OnionCDK.subscribe('/test', console.log)
    //   // })
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
