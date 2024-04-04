<template>
  <section class="navigation-menu">
    <div class="navigation-menu__wrapper">
      <div v-for="button in arrNavigationMenuButton" class="navigation-menu__btn" :id="button + '-btn'" @click="changePage($event)">
        <img :src="'./src/components/icons/' + button + '.svg'" :alt="button" />
      </div>
    </div>
    <div class="navigation-menu__footer-group">
      <div class="navigation-menu__btn" id="exit-account" @click="clickExitAccountBtn">
        <img src="./icons/exit-account.svg" alt="exit" />
      </div>
      <theme-switcher />
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import clearStore from '@/utils/clearStore.js'

export default {
  name: 'navigation-menu',
  data() {
    return {
      buttonName: '',
      currentRoute: this.$route.path,
      arrNavigationMenuButton: ['task-list', 'settings'],
      // todo - общий список боковых кнопок для новых функций
      // arrNavigationMenuButton: ['home', 'task-list', 'people', 'date', 'rating', 'cloud', 'map', 'people'],
    };
  },
  computed: {
    ...mapGetters({
      getUserId: 'userStore/userId',
    }),
  },
  methods: {
    ...mapActions({
      changeUserId: 'userStore/changeUserId',
      changeUserEmail: 'userStore/changeUserEmail',
      changeUserName: 'userStore/changeUserName',
    }),

    clickExitAccountBtn() {
      this.changeUserId('');
      this.changeUserEmail('');
      this.changeUserName('');

      localStorage.removeItem('isAuthenticated');
      clearStore.clearStoreData()
      this.$router.push('/auth');
    },

    changePage(event) {
      const clickBtnId = event.target.closest('.navigation-menu__btn').id;

      if (clickBtnId === 'task-list-btn') {
        this.$router.push('/');
        return;
      }
      if (clickBtnId === 'settings-btn') {
        this.$router.push('/settings');
        return;
      }
    },
  },

  mounted() {
    document.querySelectorAll('.navigation-menu__btn').forEach((element) => {
      element.classList.remove('navigation-menu__btn_active');
    });
    if (this.currentRoute === '/') {
      document.querySelector('#task-list-btn').classList.add('navigation-menu__btn_active');
      return;
    }
    if (this.currentRoute === '/settings') {
      document.querySelector('#settings-btn').classList.add('navigation-menu__btn_active');
      return;
    }
  },
};
</script>

<style scoped lang="scss"></style>
