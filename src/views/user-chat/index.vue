<template>
  <div class="user-chat">
    <!--导航栏-->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!--消息列表-->
    <van-cell-group class="message-list" ref="message-list">
<!--      <div v-for="(item, index) in messages" :key="index">-->
        <van-cell class="message-item" center v-for="(item, index) in messages" :key="index">
          <div class="message-item-right" v-if="index % 2 ===0">
            <div class="message-item-text">{{ item.msg }}</div>
            <van-image
              width="40"
              height="40"
              round
              src="https://img01.yzcdn.cn/vant/apple-1.jpg"
            />
          </div>
          <div class="message-item-left" v-else>
            <van-image
              width="40"
              height="40"
              round
              src="https://img01.yzcdn.cn/vant/cat.jpeg"
            />
            <div class="message-item-text">{{ item.msg }}</div>
          </div>
        </van-cell>
<!--      </div>-->
    </van-cell-group>
    <!--发送消息-->
    <van-cell-group class="send-message-wrap">
      <van-field v-model="message"
                 placeholder="请输入消息"
                 :border="false"
      />
      <van-button size="small"
                  type="primary"
                  class="sendBtn"
                  @click="onSend"
      >发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { setItem, getItem } from '../../utils/storage'

export default {
  name: 'UserChat',
  data () {
    return {
      message: '',
      socket: null, // WebSocket通信对象
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  watch: {
    // 监视messages，只要messages的值发生改变就把当前的messages存到本地存储中
    messages () {
      setItem('chat-messages', this.messages)
      // 如果你要在操作数据之后立即操作数据影响的视图DOM，
      // 那么最好放在$nextTick()中
      // 数据改变影响视图更新这件事不是立刻的
      this.$nextTick(() => {
        // 每次有新消息时，让消息列表滚动到最底部
        this.scrollToBottom()
      })
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  created () {
    const socket = io('ws://localhost:3000')
    this.socket = socket
    window.socket = socket
    socket.on('connect', function () {
      console.log('连接建立成功了！')
    })
    // 监听 message 事件，接收服务端消息
    socket.on('msg', (data) => {
      // 把对方发给我的消息放到数组中
      this.messages.push(data)
      console.log(data)
    })
    socket.on('disconnect', function () {
      console.log('断开连接了')
    })
  },
  methods: {
    onSend () {
      // 请求发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('send', data)
      // 把用户发出去的消息存储到数组中
      this.messages.push(data)
      // 清空输入框的内容
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
  .send-message-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  .sendBtn {
    width: 20%;
  }
  .message-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .message-item {
    color: red;
    display: flex;
    align-items: center;
    .message-item-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .message-item-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
  .message-item-text {
    margin: 0 15px;
  }
</style>
