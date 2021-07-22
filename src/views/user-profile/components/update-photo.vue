<template>
  <div class="update-photo">
    <img :src="image" alt="" ref="image" class="image">
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '../../../api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      // type: File,
      required: true
    }
  },
  mounted () {
    // 获取需要裁切的图片DOM
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    console.log(this.cropper)
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  methods: {
    getCroppedCanvas () {
      return new Promise((resolve, reject) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 如果要求Content-Type是multipart/form-data，则必须要提交FormData数据对象，专门用于文件上传的，不能提交{},这个没有用
      // const fd = new FormData()
      // fd.append('photo', this.file)
      await updateUserPhoto(fd)
      this.$toast.success('保存成功')
      // 更新父组件中的用户头像
      this.$emit('update-photo', window.URL.createObjectURL(file))
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000000;
  }

  .image {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
</style>
