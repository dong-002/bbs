<template>
  <div>
    <div class="header" v-show="showHeader">
      <div
        class="header-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <!-- logo -->
        <div class="logo">
          <router-link to="/" @click="toFirst">
            <span
              v-for="item in logo"
              :key="item"
              :style="{ color: item.color }"
              >{{ item.letter }}</span
            >
          </router-link>
        </div>
        <!-- 分区模块 -->
        <div class="menu-panel">
          <router-link
            :class="[
              'menu-list',
              activePBoardId == 0 && activeBoardId == 0 ? 'active' : '',
            ]"
            to="/"
            @click="toFirst"
            >首页</router-link
          >
          <template v-for="board in boardList" :key="board">
            <el-popover
              placement="bottom-start"
              :width="300"
              trigger="hover"
              v-if="board.children.length > 0"
            >
              <template #reference>
                <span
                  :class="[
                    'menu-list',
                    activePBoardId == board.boardId ? 'active' : '',
                  ]"
                  @click="boardClick(board)"
                  >{{ board.boardName }}</span
                >
              </template>
              <div class="sub-board-list">
                <span
                  :class="[
                    'sub',
                    activeBoardId == subBoard.boardId ? 'active' : '',
                  ]"
                  v-for="subBoard in board.children"
                  :key="subBoard"
                  @click="subBoardClick(subBoard)"
                  >{{ subBoard.boardName }}</span
                >
              </div>
            </el-popover>
            <span
              :class="[
                'menu-list',
                activePBoardId == board.boardId ? 'active' : '',
              ]"
              v-else
              @click="boardClick(board)"
              >{{ board.boardName }}</span
            >
          </template>
        </div>
        <!-- 用户信息模块 -->
        <div class="user-info-panel">
          <el-button type="primary" class="option-btn" @click="newPost">
            发帖<span class="iconfont icon-add"></span>
          </el-button>
          <el-button
            type="primary"
            class="option-btn"
            :style="{ 'margin-left': '5px' }"
            @click="gotoSearch"
          >
            搜索<span class="iconfont icon-search"></span>
          </el-button>
          <!-- 登录后 用户头像和消息 -->
          <div class="user-info" v-if="userInfo.userId">
            <el-dropdown class="message">
              <el-badge
                :value="messageCount.total"
                class="item"
                :hidden="messageCount.total == null || messageCount.total == 0"
              >
                <span class="iconfont icon-message"></span>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="gotoMessage('reply')"
                    class="message-count-item"
                    ><span class="text">回复我的</span
                    ><span class="count-tag" v-if="messageCount.reply > 0">{{
                      messageCount.reply > 99 ? "99+" : messageCount.reply
                    }}</span></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('likePost')"
                    class="message-count-item"
                    ><span class="text">赞了我的文章</span
                    ><span class="count-tag" v-if="messageCount.likePost > 0">{{
                      messageCount.likePost > 99 ? "99+" : messageCount.likePost
                    }}</span></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('downloadAttachment')"
                    class="message-count-item"
                    ><span class="text">下载了我的附件</span
                    ><span
                      class="count-tag"
                      v-if="messageCount.downloadAttachment > 0"
                      >{{
                        messageCount.downloadAttachment > 99
                          ? "99+"
                          : messageCount.downloadAttachment
                      }}</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('likeComment')"
                    class="message-count-item"
                    ><span class="text">赞了我的评论</span
                    ><span
                      class="count-tag"
                      v-if="messageCount.likeComment > 0"
                      >{{
                        messageCount.likeComment > 99
                          ? "99+"
                          : messageCount.likeComment
                      }}</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('sys')"
                    class="message-count-item"
                    ><span class="text">系统消息</span
                    ><span class="count-tag" v-if="messageCount.sys > 0">{{
                      messageCount.sys > 99 ? "99+" : messageCount.sys
                    }}</span></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown class="my-info">
              <Avatar :userId="userInfo.userId" :addLink="false"></Avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="gotoUserCenter(userInfo.userId)"
                    >我的主页</el-dropdown-item
                  >
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- 登录前 登录、注册按钮 -->
          <el-button-group :style="{ 'margin-left': '10px' }" v-else>
            <el-button type="primary" plain @click="loginRegister(1)"
              >登录</el-button
            >
            <el-button type="primary" plain @click="loginRegister(0)"
              >注册</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    <div class="body-content">
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <div class="footer" v-if="showFooter">
      <div
        class="footer-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <el-row>
          <el-col :span="6"
            ><div class="logo">
              <span
                v-for="item in logo"
                :key="item"
                :style="{ color: item.color }"
                >{{ item.letter }}</span
              >
            </div>
            <div class="motto">今天也是元气满满的一天</div>
          </el-col>
          <el-col :span="6"
            ><div class="title">网站相关</div>
            <div><a href="/post/GV7fN5Ye3YMTJJn">规章制度</a></div>
            <div><a href="javascript:void(0);">免责声明</a></div></el-col
          >
          <el-col :span="6"
            ><div class="title">友情链接</div>
            <div><a href="javascript:void(0);">友情链接</a></div></el-col
          >
          <el-col :span="6"
            ><div class="title">站长信息</div>
            <div class="info">
              <div class="QQ">
                <img src="../assets/qq.jpg" />
              </div>
              <span class="text">扫码添加站长</span>
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <!-- 回到顶部 -->
    <el-backtop :bottom="100" :right="80">
      <template #default>
        <span class="iconfont icon-top"></span>
      </template>
    </el-backtop>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginAndRegister from "./LoginAndRegister.vue";
import { useStore } from "../store/index.js";
const store = useStore();
const { proxy } = getCurrentInstance(); //通过proxy可以拿到全局变量 proxy相当于vue2中的this
const router = useRouter();
const route = useRoute();

const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  loadMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
};
//logo字母
const logo = ref([
  {
    letter: "E",
    color: "#3285FF",
  },
  {
    letter: "a",
    color: "#FB3624",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
  {
    letter: "y",
    color: "#3285FF",
  },
  {
    letter: "b",
    color: "#25B24E",
  },
  {
    letter: "b",
    color: "#FFBA02",
  },
  {
    letter: "s",
    color: "#3285FF",
  },
]);
// header是否显示
const showHeader = ref(true);

//滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset;
  return scrollTop;
};
const initScrollTop = () => {
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    //滚动条大于120就隐藏header
    if (currentScrollTop > 120) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};
// 渲染结束就监听获取滚动条的高度
onMounted(() => {
  initScrollTop();
  getUserInfo(); //获取用户信息
  getSysSetting();
});

const loginRegisterRef = ref();
//注册、登录和找回密码都是同一个弹框，但是里面内容不太一样
const loginRegister = (type) => {
  loginRegisterRef.value.showPanel(type);
};

const getUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  //刷新页面更新状态管理中的用户信息
  store.updateLoginUserInfo(result.data);
};
// 监听用户登录
const userInfo = ref({});
watch(
  // 这里要用箭头函数转换一下 直接监听不到
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
// 监听登录弹框
watch(
  () => store.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginRegister(1);
    }
  },
  { immediate: true, deep: true }
);

// 板块信息
const boardList = ref();
const loadBoard = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.saveBoardList(result.data);
};
loadBoard();
// header中的一级板块高亮
const activePBoardId = ref(0);
watch(
  () => store.activePBoardId,
  (newVal, oldVal) => {
    if (newVal != undefined) {
      activePBoardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);
// header中的二级板块高亮
const activeBoardId = ref(0);
watch(
  () => store.activeBoardId,
  (newVal, oldVal) => {
    if (newVal != undefined) {
      activeBoardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);
const toFirst = () => {
  activePBoardId.value = 0;
  activeBoardId.value = 0;
};
// 点击板块跳转
const boardClick = (board) => {
  router.push(`/forum/${board.boardId}`);
};
const subBoardClick = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

// 发帖
const newPost = () => {
  if (!store.loginUserInfo) {
    loginRegister(1);
  } else {
    router.push("/newPost");
  }
};

// 消息
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};
const messageCount = ref({});
const loadMessageCount = async () => {
  const result = await proxy.Request({
    url: api.loadMessageCount,
  });
  if (!result) {
    return;
  }
  messageCount.value = result.data;
  store.updateMessageCount(result.data);
};
watch(
  () => store.messageCountInfo,
  (newVal, oldVal) => {
    messageCount.value = newVal || {};
  },
  { immediate: true, deep: true }
);
watch(
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);
const gotoUserCenter = (userId) => {
  router.push(`/user/${userId}`);
};
const logout = () => {
  proxy.Confirm("确定退出吗？", async () => {
    const result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.updateLoginUserInfo(null);
  });
};

// 获取系统是否开启评论
const getSysSetting = async () => {
  const result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  store.saveSysSetting(result.data);
};
// 搜索
const gotoSearch = () => {
  router.push("/search");
};

const showFooter = ref(true);
watch(
  () => route.path,
  (newVal, oldVal) => {
    if (newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1) {
      showFooter.value = false;
    } else {
      showFooter.value = true;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  // 阴影: x轴 y轴 阴影模糊半径 阴影扩散半径
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 999;
  .header-content {
    display: flex;
    height: 60px;
    margin: 0 auto;
    align-items: center;
    .logo {
      font-size: 28px;
      margin-right: 5px;
    }
    .menu-panel {
      flex: 1;
      .menu-list {
        margin-left: 25px;
        cursor: pointer;
        color: rgb(100, 100, 100);
      }
      .menu-list:hover {
        color: #409eff;
      }
      .active {
        color: #409eff;
      }
    }
    .user-info-panel {
      display: flex;
      align-items: center;
      width: 300px;
      .option-btn {
        .iconfont {
          margin-left: 3px;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        margin-left: 10px;
        .message {
          cursor: pointer;
          margin-right: 30px;
          .iconfont {
            font-size: 25px;
          }
        }
        .my-info {
          width: 50px;
          height: 50px;
          cursor: pointer;
        }
        :deep(:focus) {
          outline: none;
        }
      }
    }
  }
}
.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub {
    background: rgb(234, 233, 233);
    cursor: pointer;
    margin: 0 5px;
    padding: 0 10px;
    border-radius: 8px;
    margin-top: 8px;
    color: rgb(129, 129, 129);
  }
  .sub:hover {
    color: #409eff;
  }
  .active {
    color: #409eff;
  }
}

.body-content {
  margin-top: 60px;
  position: relative;
  min-height: calc(100vh - 210px);
}

.message-count-item {
  display: flex;
  .text {
    flex: 1;
  }
  .count-tag {
    margin-left: 8px;
    width: 23px;
    height: 18px;
    line-height: 18px;
    background: #f56c6c;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    font-size: 13px;
  }
}

.footer {
  background: rgb(230, 230, 230);
  height: 140px;
  margin-top: 10px;
  .footer-content {
    margin: 0 auto;
    padding: 10px 0;
    .logo {
      font-size: 28px;
      margin-right: 5px;
    }
    .motto {
      margin-top: 10px;
      color: #646464;
    }
    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }
    a {
      color: #646464;
      font-size: 14px;
    }
    .info {
      display: flex;
      align-items: center;
      .QQ {
        width: 80px;
        height: 80px;
        img {
          height: 100%;
        }
      }
      .text {
        font-size: 12px;
        padding-left: 10px;
      }
    }
  }
}
.icon-top {
  color: #646464;
  font-size: 20px;
}
</style>