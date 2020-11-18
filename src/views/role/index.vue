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
      <el-table :data="roleData" style="width: 100%">
        <el-table-column label="角色名称" prop="role" min-width="140" />
        <el-table-column align="right" width="150" min-width="140">
          <template slot-scope="scope">
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: center;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div id="pageNation">
        <el-pagination small layout="prev, pager, next" :total="total" />
      </div>
    </el-col>

    <!-- 新增编辑时的dialog -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="role">
          <el-input v-model="form.role" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
          <el-tree
            ref="menu"
            :data="menuData"
            :default-checked-keys="defaultCheck"
            show-checkbox
            default-expand-all
            node-key="_id"
            highlight-current
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="cancelForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteOneRole, addRole, updateOneRole } from '@/api/role'
import { getRouteList, getRouteLists } from '@/api/menu'
export default {
  name: 'Role',
  data() {
    return {
      menuList: [], // 菜单列表
      menuData: [], // 树形菜单数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuNodeAll: false, // 是否是全选状态
      defaultCheck: [], // 树节点默认选中的_id集合
      isEdit: false, // 是否是编辑状态

      title: '新增角色', // 弹出框显示的标题
      total: 0, // 数据总条数
      pageSize: 10, // 每页显示的数据量
      currentPage: 1, // 当前页码
      dialogFormVisible: false, // 控制弹框的显隐
      roleData: [], // 数据列表
      // 表单初始化
      form: {
        role: '',
        menus: []
      },
      rules: {
        role: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData(this.currentPage, this.pageSize)
  },
  methods: {
    // 初始化表单
    restForm() {
      this.form = {
        role: '',
        menus: []
      }
    },
    // 初始化数据
    initData(page, limit) {
      const query = { page: page, limit: limit }
      getRoleList(query).then((res) => {
        const { data } = res
        this.roleData = data.results
        this.total = data.total
      })
    },
    // 点击编辑时触发 (显示已完成  还差后面的修改)
    handleEdit(index, row) {
      this.isEdit = true
      this.defaultCheck = []
      this.menuNodeAll = false
      getRouteList().then(res => {
        const { data } = res
        this.menuList = data
        const arr = this.initTree(data)
        this.menuData = arr
        getRouteLists().then(response => {
          this.defaultCheck = response.data.map(item => {
            if (row.role === 'admin') {
              this.menuNodeAll = true
              return item._id
            } else if (item.meta.roles.indexOf(row.role) > -1) {
              return item._id
            }
          })
          if (this.defaultCheck.length > 0 && this.defaultCheck.indexOf(undefined) === -1 && this.defaultCheck.length === response.data.length) {
            this.menuNodeAll = true
          }
        })
        this.form.role = row.role
        this.form._id = row._id
        this.dialogFormVisible = true
      })
    },
    // 点击删除时触发
    handleDelete(index, row) {
      this.$confirm('确认删除角色名为' + row.role + '的数据吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteOneRole({ _id: row._id }).then((res) => {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.initData(this.currentPage, this.pageSize)
          })
        })
        .catch((action) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 初始化树形数据
    initTree(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length > 0) {
          data[i].label = data[i].meta.title
          this.initTree(data[i].children)
        } else {
          data[i].label = data[i].meta.title
        }
      }
      return data
    },
    // 点击新增角色时触发
    handleAdd() {
      this.isEdit = false
      this.dialogFormVisible = true
      getRouteList().then(res => {
        const { data } = res
        this.menuList = data
        const arr = this.initTree(data)
        this.menuData = arr
      })
      this.restForm()
      this.menuNodeAll = false
    },
    // 全选
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuData : [])
    },
    // 点击取消时触发
    cancelForm() {
      this.restForm()
      this.dialogFormVisible = false
      this.menuNodeAll = false
    },
    /**
     * @param data 需要修改的数组
     * @param data1 修改的部分数据
     * @param add 修改的值
     * @param str 2组数据的唯一标识
     * **/
    // 点击创建时触发
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit === false) {
            addRole({ role: this.form.role, menus: this.$refs.menu.getCheckedNodes() }).then(res => {
              this.$message({ message: res.data.message, type: 'success' })
              this.dialogFormVisible = false
              this.initData(this.currentPage, this.pageSize)
            })
          } else if (this.isEdit === true) {
            updateOneRole({ role: this.form.role, menus: this.$refs.menu.getCheckedNodes(), _id: this.form._id }).then(res => {
              this.$message({ message: res.data.message, type: 'success' })
              this.dialogFormVisible = false
              this.initData(this.currentPage, this.pageSize)
            })
          }
        } else {
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.initData(this.currentPage, val)
    },
    handleCurrentChange(val) {
      this.initData(val, this.pageSize)
    }
  }
}
</script>

<style scoped>
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

