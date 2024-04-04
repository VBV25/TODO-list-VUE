<template>
  <div @click="clearStyleActive($event)" class="tasklist-content">
    <navigation-menu />
    <list-boards />
    <main>
      <tasklist-header />
      <div class="list-column">
        <div class="list-column__wrapper">
          <column-tasks v-for="column in columnsTasksList" :key="column.id" :current-column="column" />
        </div>
      </div>
    </main>
  </div>
  <popup-todo-list />
  <error-popup />
  <confirmation-deletion />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import NavigationMenu from '@/components/NavigationMenu.vue';
import ListBoards from '@/components/ListBoards.vue';
import TasklistHeader from '@/components/TasklistHeader.vue';
import ColumnTasks from '@/components/ColumnTasks.vue';
import PopupTodoList from '@/components/PopupTodoList.vue';

export default {
  name: 'home-page',
  components: {
    NavigationMenu,
    ListBoards,
    TasklistHeader,
    ColumnTasks,
    PopupTodoList,
  },
  data() {
    return {
      columnsTasksList: this.columnsList,
    };
  },

  computed: {
    ...mapGetters({
      columnsList: 'taskStore/columnsList',
    }),

    getDataLocalStorage: function () {
      return JSON.parse(localStorage.getItem('isAuthenticated'));
    },
  },
  watch: {
    columnsList: function (newData) {
      this.columnsTasksList = newData;
    },
  },
  methods: {
    ...mapActions({
      changeUserId: 'userStore/changeUserId',
      changeUserEmail: 'userStore/changeUserEmail',
    }),

    clearStyleActive(event) {
      const clickElement = event.target;
      const dropDownBtnChange = document.querySelectorAll('.drop-btn-group');
      if (!clickElement.closest('.change-btn') && !clickElement.closest('.drop-btn-group')) {
        dropDownBtnChange.forEach((element) => {
          element.classList.remove('drop-btn-group_visible');
        });
      }
    },
  },

  async created() {
    const userInfo = this.getDataLocalStorage;
    if (userInfo) {
      this.$router.push('/');
      await this.changeUserId(userInfo.userData.idUser);
      await this.changeUserEmail(userInfo.userData.userEmail);
    } else {
      this.$router.push('/auth');
    }
  },
};
</script>
