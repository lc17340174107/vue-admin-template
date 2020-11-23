<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
/*分页样式*/
#pageNation {
  text-align: center;
  display: none;
}
@media screen and (max-width: 420px) {
  .block {
    display: none;
  }
  #pageNation {
    display: block;
  }
}
</style>
