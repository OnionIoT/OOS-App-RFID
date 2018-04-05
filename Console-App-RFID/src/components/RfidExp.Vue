<template>
  <div class="container">
    <div class="columns">
      <div class="column col-6 col-xs-12">
        <img src="~@/assets/rfid-nfc-expansion.png" class="img-responsive">
      </div>
      <div class="column col-6 col-xs-12">
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
  </div>
</template>

<script>
export default {
  name: 'RfidExp',
  data () {
    return {
      cards: [
        {
          uid: '123456789',
          time: 'Apr 5, 2018'
        },
        {
          uid: 'qwertyuiop',
          time: 'Apr 7, 2018'
        }
      ]
    }
  }
}
</script>
