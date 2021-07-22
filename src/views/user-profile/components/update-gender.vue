<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '../../../api/user'
export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onGenderChange (picker, value, index) {
      // console.log(index)
      this.defaultIndex = index
    },
    async onConfirm () {
      // 请求提交更详细用户性别
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      await updateUserProfile({
        gender: this.defaultIndex
      })
      // 更新成功 -> 修改父组件的name -> 关闭弹出层
      this.$emit('close')
      this.$emit('input', this.defaultIndex)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped>

</style>
