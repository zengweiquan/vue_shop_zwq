<template>

  <el-container class="home_container">
    <!-- 头部区域-->
    <el-header>
      <div>
        <img src="../assets/icon.jpg"  alt="图片加载中"/>
        <span>电商管理系统</span>
      </div>
      <el-button type="primary" @click="exit">退出</el-button>
    </el-header>
    <!--页面主体区域 -->
    <el-container>
      <!-- 侧边栏-->
      <el-aside width="200px">
        <div class="loggle-button" @click="toggleCollaose">|||</div>
        <!-- 侧边栏菜单区-->
        <el-menu background-color="#373d41"
              text-color="#fff"
              active-text-color="#109EFF"
              :unique-opened="true" :default-active="activePath"
                          :collapse="isCollapse" :collapse-transition="false" router>  <!-- unique-opened 打开一个菜单关闭其他菜单-->


              <!-- 一级菜单的模板区-->
              <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
                <template slot="title">
                  <!-- 图标-->
                  <i :class="iconsObj[item.id]"></i>
                  <!-- 文本-->
                  <span>{{item.authName}}</span>
                </template>

                  <!-- 二级菜单-->
                  <el-menu-item  :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path+'')">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{subItem.authName}}</span>
                    </template>
                  </el-menu-item>
              </el-submenu>

            </el-menu>
      </el-aside>
      <!-- 右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default{
    data(){
      return{
        //左侧菜单数据
        menulist:[],
        iconsObj:{'125':'iconfont icon-user',
                  '103':'iconfont icon-tijikongjian',
                  '101':'iconfont icon-shangpin',
                  '102':'iconfont icon-danju',
                  '145':'iconfont icon-baobiao'},
                  //是否折叠
              isCollapse:false,
              //被激活的动态地址
              activePath :''

      }
    },
    /* 页面创建时执行*/
    created() {
      this.getMeunList()
      this.activePath=window.sessionStorage.getItem("activePath")
    },
    methods:{
      exit(){
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      //获取所有的菜单
      async getMeunList(){
        const {data: res} = await this.$http.get('menus');
        if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.menulist=res.data
      },
      //点击切换菜单的展开与折叠
      toggleCollaose(){
        this.isCollapse =!this.isCollapse
      },
      saveNavState(activePath){
        window.sessionStorage.setItem("activePath",activePath);
      }
    },
}
</script>

<style lang="less"  scoped>
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 30px;
      }
    }
  }
  .el-aside{
    background-color: #373d41;
  }
  .el-main{
    background-color: #eee;
  }
  .home_container{
    width: 100%;
    height: 100%;
  }
  img{
   width: 50px;
   height: 60px;
  }
.iconfont{
  margin-right: 20px;
}
.el-aside{
  background-color: #333744;
    .el-menu{
       border-right: none;
    }
  }
  .loggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }


</style>
