<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '../../../api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      // 请求提交更详细用户生日
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserProfile({
        birthday: date
      })
      // 更新成功 -> 修改父组件的name -> 关闭弹出层
      this.$emit('close')
      this.$emit('input', date)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped>

</style>
