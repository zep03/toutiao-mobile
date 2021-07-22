<template>
  <div class="update-name">
    <!--导航栏-->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '../../../api/user'

export default {
  name: 'UpdateName',
  data () {
    return {
      localName: this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      // 请求提交更详细用户昵称
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await updateUserProfile({
          name: this.localName
        })
        // 更新成功 -> 修改父组件的name -> 关闭弹出层
        this.$emit('close')
        this.$emit('update-name', this.localName)
        this.$toast.success('保存成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped>
  .name-field-wrap {
    padding: 10px;
  }
</style>
