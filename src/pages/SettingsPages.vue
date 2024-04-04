<template>
  <div @click="clearStyleActive($event)" class="tasklist-content">
    <navigation-menu />
    <main>
      <tasklist-header />
      <div class="board-administration">
        <board-administration v-for="board in boardsList" :board-data="board" />
      </div>
    </main>
  </div>
  <error-popup />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import NavigationMenu from '@/components/NavigationMenu.vue';
import TasklistHeader from '@/components/TasklistHeader.vue';
import BoardAdministration from '@/components/BoardAdministration.vue';

export default {
  name: 'settings-pages',
  components: {
    NavigationMenu,
    TasklistHeader,
    BoardAdministration,
  },
  data() {
    return {
      ownerInfo: '',
    };
  },

  computed: {
    ...mapGetters({
      boardsList: 'taskStore/boardsList',
    }),
    getDataLocalStorage: function () {
      return JSON.parse(localStorage.getItem('isAuthenticated'));
    },
  },
  methods: {
    ...mapActions({
      changeErrorMessage: 'popupData/getError',
      getBoardsTasks: 'taskStore/getBoardsTasks',
    }),

    clearStyleActive(event) {
      const clickElement = event.target;
      const activeUserCard = document.querySelector('.user-accesses-card_active');
      if (!clickElement.closest('.user-accesses-card') && activeUserCard) {
        activeUserCard.classList.remove('user-accesses-card_active');
      }
    },
  },

  async created() {
    const dataUser = {};
    const userInfo = this.getDataLocalStorage;
    if (userInfo) {
      dataUser.userId = userInfo.userData.idUser;
      this.$router.push('/settings');
      await this.getBoardsTasks(dataUser);
    } else {
      this.$router.push('/auth');
    }
  },
};
</script>
<style scoped lang="scss">
main {
  width: 95%;
}
</style>
