<template>
  <div class="main-task-header">
    <h1 class="main-task-header__title">{{ textStore.welcomeHeaderText }}</h1>

    <div v-if="currentRoute === '/'" class="main-task-header__instruments-group">
      <div v-if="userPermissions.includes('manage-board-statuses')" class="main-task-header__create-new-task-list" @click="openPopupTodoList">
        New Task List
      </div>
    </div>

    <div class="main-task-header__info-block">
      <div class="main-task-header__date">
        <img src="./icons/date-logo.svg" alt="Дата" />
        <p class="main-task-header__date-text">{{ currentDate }}</p>
      </div>
      <div class="main-task-header__account">
        <img class="main-task-header__account-img" :src="'./src/assets/img/' + userImg" alt="Фото пользователя" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formattingDate, getCurrentDate } from '@/utils/utils.js';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'tasklist-header',

  data() {
    return {
      date: getCurrentDate(),
      currentDate: formattingDate(getCurrentDate()),
      currentRoute: this.$route.path,
      textStore: globalTextStore,
      showAddTaskListButton: true,
    };
  },

  computed: {
    ...mapGetters({
      getUserEmail: 'userStore/userEmail',
      currentBoardId: 'taskStore/currentBoardId',
      userImg: 'userStore/userImg',
      userPermissions: 'userStore/userPermissions',
    }),
  },

  methods: {
    ...mapActions({
      changePopupType: 'popupData/getPopupType',
      changePopupTitle: 'popupData/getPopupTitle',
    }),

    openPopupTodoList() {
      this.changePopupTitle('Create new column');
      this.changePopupType('createTaskColumn');
    },
  },
};
</script>

<style></style>
