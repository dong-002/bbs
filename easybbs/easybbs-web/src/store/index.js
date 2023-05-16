import { defineStore } from "pinia";

export const useStore=defineStore('store',{
  state: ()=> {
    return {
      //用户登录信息
      loginUserInfo: null,
       //是否显示登录框
      showLogin: false,
       //板块信息
      boardList: [],
       //一级板块
      activePBoardId: 0,
       //二级板块
      activeBoardId: 0,
      // 消息数量
      messageCountInfo: {},
      // 是否开启评论
      sysSetting: null
    }
  },
  getters: {
    getSubBoardList:state=>(boardId)=>{
      let board=state.boardList.find(item=>{
        return item.boardId==boardId
      })
      // 返回二级板块
      return board?board.children:[]
    }
  },
  actions: {
    updateLoginUserInfo(value) {
      this.loginUserInfo=value
    },
    changeShowLogin(value) {
      this.showLogin=value
    },
    saveBoardList(value) {
      this.boardList=value
    },
    setActivePBoardId(value) {
      this.activePBoardId=value
    },
    setActiveBoardId(value) {
      this.activeBoardId=value
    },
    updateMessageCount(value) {
      this.messageCountInfo=value
    },
    // 已读消息要减少
    readMessage(value){
      this.messageCountInfo.total=this.messageCountInfo.total-this.messageCountInfo[value]
      this.messageCountInfo[value]=0
    },
    saveSysSetting(value){
      this.sysSetting=value
    }
  }
})