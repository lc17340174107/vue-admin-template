<template>
  <div>
    <div v-for="(item, index) in icons" id="iconBox" :key="index" style="width: 25%" @click="selectedIcon(item)">
      <div>
        <svg-icon
          :icon-class="item"
        />
        <span style="margin-left: 5px">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectIcons',
  data() {
    return {
      // 图标元素数组，目前是放在icons下面的svg路径下的
      icons: ['dashboard', 'role', 'account', 'example', 'menu', 'eye', 'eye-open', 'form', 'link', 'nested', 'password', 'table', 'tree', 'user']
    }
  },
  methods: {
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    }
  }
}
</script>

<style scoped>
  #iconBox {
    display: inline-block;
    padding: 10px;
    cursor: pointer;
    -moz-transition-duration: 300ms;
    -o-transition-duration: 300ms;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
  }
  #iconBox:hover {
    background-color: #ccc;
  }
</style>
