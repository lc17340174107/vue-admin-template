<template>
  <div class="app-container">
    <el-col :span="1.5">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >新增
      </el-button>
    </el-col>
    <el-col :span="24">
      <el-table
        v-loading="loading"
        :data="menusData"
        style="width: 100%"
        row-key="_id"
        border
        :tree-props="{children: 'children'}"
      >
        <el-table-column
          label="菜单名称"
          min-width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.meta.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="图标"
          min-width="50"
          width="100"
        >
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.meta.icon" :icon-class="scope.row.meta.icon" />
          </template>
        </el-table-column>
        <el-table-column
          label="name"
          min-width="120"
          prop="name"
        />
        <el-table-column
          label="path"
          min-width="120"
          prop="path"
        />
        <el-table-column
          label="component"
          min-width="120"
          prop="component"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!-- 新增编辑时的dialog -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <!--        菜单选择dialog-->
          <el-col :span="24">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
            >
              <select-icons @selected="select" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  style="height: 32px;width: 16px;"
                />
              </el-input>
            </el-popover>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="cancelForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getRouteList } from '@/api/menu'
import selectIcons from '@/components/Icon/selectIcons'

export default {
  components: { selectIcons },
  data() {
    return {
      menusData: [], // 菜单结构数据
      loading: true,
      title: '新增菜单', // 弹出框显示的标题
      dialogFormVisible: false, // 控制弹框的显隐
      form: {
        parentId: null,
        path: '',
        component: '',
        title: '',
        name: '',
        icon: '',
        children: []
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 选择图标触发
    select(name) {
      console.log(this.form)
      this.form.icon = name
    },
    // 获取菜单结构
    initData() {
      getRouteList().then(res => {
        this.menusData = res.data
        this.loading = false
      })
    },
    // 新增
    handleAdd() {
      this.restForm()
      this.dialogFormVisible = true
      this.title = '新增菜单'
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
    },
    // 删除
    handleRemove(row) {
      console.log(row)
    },
    // 点击创建时触发
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
        } else {
          return false
        }
      })
    },
    // 点击取消触发
    cancelForm() {
      this.dialogFormVisible = false
      this.restForm()
    },
    // 重置表单数据
    restForm() {
      this.form = {
        parentId: null,
        path: '',
        component: '',
        title: '',
        name: '',
        icon: '',
        children: []
      }
    }
  }
}
</script>
