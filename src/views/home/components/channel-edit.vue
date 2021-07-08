<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button @click="isEdit = !isEdit" type="danger" round size="small" plain slot="default">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item @click="onUserChannelClick(channel, index)" :icon="(isEdit && index !==0) ? 'clear' : ''" class="grid-item" :class="{ active: index === active }" v-for="(channel, index) in userChannels" :key="index" :text="channel.name" />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item @click="onAdd(channel)" icon="add" class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannel } from '../../../api/channel'
import { mapState } from 'vuex'
import { setItem } from '../../../utils/storage'

export default {
  name: 'channel-edit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道数据列表
      isEdit: false // 控制编辑的显示状态
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    // 推荐到频道列表
    recommendChannels () {
      // 思路： 所有频道 - 我的频道
      // filter方法，过滤数组,根据方法返回的布尔值true来收集数据
      // filter方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断当前遍历的channel 是否属于 我的频道中的channel
        // find方法查找满足条件的单个元素，如果没找到满足条件的，则返回undefined,再取反，变成true，
        // 然后filter会把返回值为true的channel过滤出来
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      console.log('channel')
      this.userChannels.push(channel)
      // 数据持久化
      if (this.user) {
        // 如果登录了，数据存储在线上
        await addUserChannels({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length
            }
          ]
        })
      } else {
        // 如果没有登录，数据存储在本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，则删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，则切换到指定的频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      console.log('sssss')
      // 如果删除的是当前激活频道前面的频道，
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        // 如果登录了，数据存储在线上
        await deleteUserChannel(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">

  .channel-edit {
    padding-top: 34px;
    .van-button {
      width: 72px;
      height: 35px;
    }
    .channel-title {
      font-size: 15px;
      color: #333333;
    }
    .grid-item {
      width: 80px;
      height: 43px;
      white-space: nowrap;
      text-overflow: ellipsis;
      /deep/ .van-grid-item__content {
        background-color: #f4f5f6;
        .van-grid-item__text {
          font-size: 14px;
          color: #222222;
          margin-top: 0;
        }
      }
      /deep/ .van-grid-item__icon {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 20px;
        color: #ddd;
      }
    }
    .active {
      /deep/ .van-grid-item__text {
        color: red !important;
      }
    }
  }
</style>
