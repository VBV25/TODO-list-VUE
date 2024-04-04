<!-- email: 'DarthVader@mail.com' -->
<template>
  <router-view />
  <notification-window />
</template>

<script>
import { RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {userInfo } from '@/utils/utils.js';

export default defineComponent({
  name: 'App',
  components: { RouterView },

  data() {
    return {
      userImg: '',
    };
  },

  methods: {
    ...mapActions({
      changeUserId: 'userStore/changeUserId',
      changeUserEmail: 'userStore/changeUserEmail',
      changeUserImg: 'userStore/changeUserImg',
    }),

    getImgOwnerTaskList(emailOwner) {
      const userInObj = userInfo.find((user) => {
        return user.email === emailOwner;
      });
      if (userInObj && userInObj.img) {
        this.userImg = userInObj.img;
      } else {
        this.userImg = 'account.png';
      }
    }
  },

  created() {
    const userInfo = JSON.parse(localStorage.getItem('isAuthenticated')); 
    if (userInfo) {
      this.getImgOwnerTaskList(userInfo.userData.userEmail)
      this.changeUserId(userInfo.userData.idUser);
      this.changeUserEmail(userInfo.userData.userEmail);
      this.changeUserImg(this.userImg)
    }
  },
});


</script>

<style lang="scss"></style>
