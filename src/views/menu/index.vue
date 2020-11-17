<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 2">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        ['a', 'b', 'c', 'd'],
        ['e', 'f', 'g', 'h'],
        ['i', 'j', 'k', 'l'],
        ['m', 'n', 'o', 'p']
      ]
    }
  },
  created() {
    this.init(this.arr)
  },
  methods: {
    init(arr) {
      console.log(arr)
    }
  }
}
</script>
