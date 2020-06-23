<template>
  <div>
   <!-- 面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图-->
    <el-card class="box-card">

      <!-- 搜索与添加-->
      <div style="margin-top: 15px;">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDiaLogVisble  = true">添加用户</el-button>
        </el-col>
      </div>
      <!-- 用户列表区-->
      <el-table :data="userList" border stripe>
          <el-table-column label="序号" type="index" width="50px"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" >
              <!-- 作用域插槽-->
            <template slot-scope="scope">
              <el-switch @change="userStateChanged(scope.row)"
                v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" prop="username">
            <template slot-scope="scope" class="cz_buuten">
             <!-- 修改按钮-->
              <el-tooltip class="item" effect="light" content="修改信息" placement="top-start" :enterable="false">
             <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
             </el-tooltip>
             <!-- 修改权限-->
              <el-tooltip class="item" effect="light" content="修改权限" placement="top-start" :enterable="false">
             <el-button type="success" icon="el-icon-setting" circle size="mini"></el-button>
               </el-tooltip>
             <!-- 删除按钮-->
              <el-tooltip class="item" effect="light" content="修改按钮" placement="top-start" :enterable="false">
             <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页组件-->
       <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 4, 10, 15]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户" :visible.sync="addDiaLogVisble" width="50%" @close="addDislogClose">

      <!-- 类容主体区-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="">
        <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="">
        <el-input v-model="addForm.password" tyep="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="">
        <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="">
        <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框-->
    <el-dialog title="修改用户"
      :visible.sync="editDialogVisible" width="50%">
     <!-- 主体区-->
     <el-form :model="editForm" ref="editFormRef" label-width="70px" @close="editDialogClosed">
         <el-form-item label="用户名" prop="" >
         <el-input v-model="editForm.username" disabled></el-input>
         </el-form-item>

         <el-form-item label="邮箱" prop="">
         <el-input v-model="editForm.email"></el-input>
         </el-form-item>
         <el-form-item label="手机号码" prop="">
         <el-input v-model="editForm.mobile"></el-input>
         </el-form-item>
    </el-form>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        //获取用户列表内的参数对象
        queryInfo:{
          query:'',
          //当前页码
          pagenum:1,
          //当前显示多少条
          pagesize:3
        },
        userList:[],
        total:0,
        /* 控制添加用户对话框的显示于隐藏*/
        addDiaLogVisble:false,
        //控制修改用户的对话框
        editDialogVisible:false,
        //添加用户的数据
        addForm:{
          username:'',
          password:'',
          email:'',
          phone:''
        },
        //添加表单的验证规则
        addFormRules:{
          username1:[
           { required: true, message: '请输入活动名称', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        //查询用户信息对象
        editForm:{}
      }
  },
  created(){
      this.getUserList()
  },
  methods:{
     async getUserList(){
         const {data: res} = await this.$http.get('users',{params:this.queryInfo})
         console.log(res)
         if(res.meta.status!==200) return this.$message.error('获取用户列表失败!')
         this.userList=res.data.users
         this.total=res.data.total
      },
      //监听pagesize改变的参数的事件
      handleSizeChange(newsize){
        this.queryInfo.pagesize=newsize;
        this.getUserList()
      },
      //监听页码值改变的事件
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage;
        this.getUserList()
      },
      /* 监听switch开关的改变*/
      async userStateChanged(userinfo){
       const {data: res} = await this.$http.put('users/'+userinfo.id+'/state/'+userinfo.mg_state)
       if(res.meta.status !==200){
         userinfo.mg_state=!userinfo.mg_state
         return this.$message.error("跟新用户状态失败！")
       }
       this.$message.success("更新用户状态成功！")
      },
      //监听添加用户对话框的关闭事件
      addDislogClose(){
       this.$refs.addFormRef.resetFields()
      },
      //添加用户
      addUser(){
        //验证表单
       this.$refs.addFormRef.validate(async valid =>{
         if(!valid) return
         //可以发起网络请求                         /* 请求路径  请求参数*/
        const {data: res} = await this.$http.post('users',this.addForm);

         if(res.meta.status !==200 && res.meta.status !==201){
            return this.$message.error(res.meta.msg)
         }
         this.$message.success(res.meta.msg)
         //隐藏添加用户的对话框
         this.addDiaLogVisble=false;
         //重新获取用户列表
         this.getUserList()
       })
      },
      //展示编辑用户的对话框
      async showEditDialog(uid){
        this.editDialogVisible=true
        const {data: res} = await this.$http.get('users/'+uid)
        if(res.meta.status !==200 && res.meta.status !==201){
          this.$message.error(res.meta.msg)
          return
        }
        this.editForm  =res.data
      },
      //监听修改用户信息对话框关闭信息
      editDialogClosed(){
        //清空类容
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      async editUserInfo(){
        const {data: res} = await this.$http.put('users/'+this.editForm.id,{
          mobile: this.editForm.mobile,
          email: this.editForm.email
        })
       if(res.meta.status !==200 && res.meta.status !==201){
         this.editDialogVisible=false
         return this.$message.error(res.meta.msg)
       }
       this.editDialogVisible=false
       this.getUserList()
       this.$message.success(res.meta.msg)
      },
      //根据id删除对应的用户信息
      async removeUserById(uid){
        //弹窗询问是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
      {confirmButtonText: '确定',cancelButtonText: '取消', type: 'warning'}).catch(err=>err)

      if(confirmResult !=='confirm'){
        return this.$message.info('已经取消删除')
      }
      const {data: res} = await this.$http.delete('users/'+uid)

      if(res.meta.status !==200){
        return this.$message.error(res.meta.msg)
      }
        this.$message.success(res.meta.msg)
        this.getUserList()
      }
   }
  }
</script>

<style lang="less" scoped="scoped">
  .el-table{
    margin-top: 80px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>
