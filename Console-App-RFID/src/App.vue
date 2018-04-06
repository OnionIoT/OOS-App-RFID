<template>
  <div id="app">
    <RfidExp/>
  </div>
</template>

<script>
import RfidExp from './components/RfidExp'

export default {
  name: 'App',
  components: {
    RfidExp
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 10px;
}
</style>
