<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="title">
          <span v-if="!isCollapse">Easybbs管理后台</span>
        </div>
        <div class="aside-menu">
          <el-menu
            class="el-menu-vertical-demo"
            :default-active="defaultActive"
            :collapse="isCollapse"
            :default-openeds="defaultOpen"
            router
            background-color="#3d3c4a"
            text-color="#fff"
            active-text-color="#fff"
            :collapse-transition="false"
          >
            <template v-for="item in menuList" :key="item">
              <el-sub-menu :index="item.path" v-if="item.children">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="subItem in item.children"
                  :key="subItem"
                  :index="subItem.path"
                >
                  <span class="menu-name">{{ subItem.menuName }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item :index="item.path" v-else>
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div
            :class="[
              'op-btn',
              'iconfont',
              isCollapse ? 'icon-expand' : 'icon-collapse',
            ]"
            @click="changeCollapse"
          ></div>
          <div class="menu-bread">
            <el-breadcrumb separator="/">
              <template v-for="item in breadCrumbList" :key="item">
                <el-breadcrumb-item v-if="item.name">{{
                  item.name
                }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="main-content">
          <div class="tag-content">
            <el-tabs v-model="defaultActive" type="border-card" @tab-change="tabClick" @edit="tabEdit">
              <el-tab-pane
                v-for="item in tabList"
                :key="item.path"
                :label="item.menuName"
                :name="item.path"
                :closable="tabList.length > 1"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="content-body">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute,useRouter } from "vue-router";
const route = useRoute();
const router=useRouter()

// 当前选中的菜单
const defaultActive = ref();
// 默认展开菜单
const defaultOpen = ref([]);
const menuList = [
  {
    menuName: "内容管理",
    icon: "icon-article",
    path: "/forum",
    children: [
      {
        menuName: "帖子管理",
        path: "/forum/article",
      },
      {
        menuName: "评论管理",
        path: "/forum/comment",
      },
      {
        menuName: "板块管理",
        path: "/forum/board",
      },
    ],
  },
  {
    menuName: "用户管理",
    icon: "icon-user",
    path: "/user",
    children: [
      {
        menuName: "用户列表",
        path: "/user/list",
      },
    ],
  },
  {
    menuName: "设置",
    icon: "icon-setting",
    path: "/setting",
    children: [
      {
        menuName: "系统设置",
        path: "/setting/sys",
      },
    ],
  },
];

const menuMap={}
const init = () => {
  menuList.forEach((item) => {
    defaultOpen.value.push(item.path);
    // 将子菜单存起来
    item.children.forEach(subItem=>{
      menuMap[subItem.path]=subItem
    })
  });
};
init();

// 左边菜单收起展开
const isCollapse = ref(false);
const asideWidth = ref(250);
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) {
    asideWidth.value = 64;
  } else {
    asideWidth.value = 250;
  }
};
// 面包屑
const breadCrumbList = ref([]);

// tab操作
const tabList = ref([]);
// 点击tab，切换路由
const tabClick=(path)=>{
  router.push(path)
}
// 删除tab
const tabEdit=(target,action)=>{
  if(action!=="remove") {
    return
  }
  let currentPath=defaultActive.value //当前的路径
  let tabs=tabList.value
  // 要删除的tab是当前选中时切换tab，要删除的不是选中的直接删除
  if(target==defaultActive.value) {
    tabs.forEach((tab,index)=>{
      if(tab.path==target) {
        // 删除当前的，选择前一个或者后一个
        let nextTab=tabs[index+1]||tabs[index-1]
        if(nextTab) {
          currentPath=nextTab
        }
      }
    })
  }
  // 删除tab
  tabList.value=tabs.filter((tab)=>{
    return tab.path!=target
  })
  if(currentPath!=defaultActive.value) {
    router.push(currentPath)
  }
}

// 监听路由
watch(
  () => route,
  (newVal, oldVal) => {
    defaultActive.value = newVal.path;
    breadCrumbList.value = route.matched; //当前的路由信息
    // 将当前的子菜单放到tab上显示
    // 没有这个tab才添加
    let currentMenu=tabList.value.some(item=>{
      return item.path==defaultActive.value
    })
    if(!currentMenu) {
      tabList.value.push(menuMap[route.path])
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" >
//菜单收起样式
.el-popper {
  border: none !important;
  .el-menu-item.is-active {
    background: var(--el-color-primary);
  }
  .el-menu-item:hover {
    color: #d8d8ee;
  }
  .el-menu--popup {
    padding: 0px;
  }
}
.layout-body {
  .aside {
    background: #3d3c4a;
    .title {
      display: flex;
      height: 50px;
      align-items: center;
      font-size: 18px;
      padding-left: 10px;
      color: #fff;
      background: #191828;
    }
    .aside-menu {
      height: calc(100vh - 50px);
      .menu-name {
        padding-left: 10px;
      }
      //去除边框
      .el-menu {
        border-right: none;
      }
      //选中的颜色
      .el-menu-item.is-active {
        color: #fff;
        background: var(--el-color-primary);
      }
      //鼠标移上去的颜色
      .el-menu-item:hover {
        color: #d8d8ee;
      }
    }
  }
  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    .op-btn {
      font-size: 18px;
      cursor: pointer;
      color: #3a3a40;
    }
    .menu-bread {
      margin-left: 10px;
    }
  }
  .main-content {
    padding: 0;
    .tag-content {
      .el-tabs--border-card {
        border: none;
      }
      .el-tabs__content {
        display: none;
      }
    }
    .content-body {
      overflow: hidden;
      padding: 10px 10px 5px 10px;
    }
  }
}
</style>