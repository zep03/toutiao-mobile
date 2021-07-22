<template>
  <div class="user-profile">
    <!--导航栏-->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!---->
    <input type="file"
           hidden
           ref="file"
           accept="image/*"
           @change="onFileChange"
    >
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        slot="default"
        width="40"
        height="40"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称"
              is-link
              @click="isEditNameShow = true"
              :value="user.name"
    ></van-cell>
    <van-cell title="性别"
              is-link
              @click="isEditGenderShow = true"
              :value="user.gender === 0 ? '男' : '女' "
    ></van-cell>
    <van-cell title="生日"
              is-link
              @click="isEditBirthdayShow = true"
              :value="user.birthday"
    ></van-cell>
    <!--修改昵称的弹出层-->
    <van-popup v-model="isEditNameShow"
               position="bottom"
    >
      <update-name
        v-if="isEditNameShow"
        @update-name="user.name = $event"
        @close="isEditNameShow = false"
        :name="user.name"
      ></update-name>
    </van-popup>
    <!--修改性别的弹出层-->
    <van-popup v-model="isEditGenderShow"
               position="bottom"
               style="height: unset"
    >
      <update-gender
        @close="isEditGenderShow = false"
        v-model="user.gender"
      ></update-gender>
    </van-popup>
    <!--修改生日的弹出层-->
    <van-popup v-model="isEditBirthdayShow"
               position="bottom"
               style="height: unset"
    >
     <update-birthday
       v-if="isEditBirthdayShow"
       v-model="user.birthday"
       @close="isEditBirthdayShow = false"
     >
     </update-birthday>
    </van-popup>
    <!--修改头像的弹出层-->
    <van-popup
      v-if="isEditPhotoShow"
      class="update-photo-popup"
       v-model="isEditPhotoShow"
       position="bottom"
       style="height: 100%"
    >
      <update-photo
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      >
      </update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user.js'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称弹出层的显示状态
      isEditGenderShow: false, // 编辑性别弹出层的显示状态
      isEditBirthdayShow: false, // 编辑生日弹出层的显示状态
      isEditPhotoShow: false, // 编辑头像弹出层的显示状态
      previewImage: null // 上传预览图片
    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      // 展示弹出层
      this.isEditPhotoShow = true
      // 在弹出层里面预览图片
      const file = this.$refs.file.files[0]
      console.log(file)
      this.previewImage = file
      // 为了解决选择相同的图片不触发change事件，
      // 所以在这里手动的清空file的value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped>
  .van-popup {
    background-color: #f5f7f9;
    height: 100%;
  }
  .update-photo-popup {
    background-color: #000;
  }
</style>
