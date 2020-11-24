<template>
  <el-popover
    placement="bottom-start"
    width="460"
    trigger="click"
  >
    <el-input slot="reference" :value="title" placeholder="点击选择上级菜单" readonly />
    <el-tree :data="tree" :highlight-current="true" :props="defaultProps" @node-click="handleNodeClick" />
  </el-popover>
</template>

<script>
import { getRouteLists } from '@/api/menu'

export default {
  name: 'TreeSelect',
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    menu: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      title: '主菜单',
      tree: [
        {
          children: [],
          meta: {
            title: '主菜单'
          }
        }
      ],
      defaultProps: {
        children: 'children',
        label: function(data) {
          return data.meta.title
        }
      }
    }
  },
  watch: {
    menu(val) {
      getRouteLists().then(res => {
        const that = this
        res.data.map(e => {
          if (e._id === val) {
            if (e.parentId !== null) {
              const obj = res.data.filter(item => {
                return item._id === e.parentId
              })
              that.title = obj[0].meta.title
            } else {
              that.title = '主菜单'
            }
          }
        })
        that.$emit('treeSelect', val)
      })
    }
  },
  created() {
    this.menus.map(e => {
      this.tree[0].children.push(e)
    })
  },
  methods: {
    handleNodeClick(data) {
      if (data.meta.title) {
        this.title = data.meta.title
      } else {
        this.title = '主菜单'
      }
      this.$emit('treeSelect', data._id)
      document.body.click()
    }
  }
}
</script>

<style scoped>

</style>
