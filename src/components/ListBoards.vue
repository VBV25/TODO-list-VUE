<template>
  <div class="list-boards">
    <div class="list-boards__wrapper">
      <div class="list-boards__header-cnt">
        <h2 class="list-boards__title">Boards List</h2>
        <div @click="openPopupTodoList" class="list-boards__create-board-btn">Add board</div>
      </div>
      <div class="list-boards__body">
        <div
          v-for="(board, index) in boardsList"
          class="list-boards__board"
          :key="board.id"
          :data-number="index"
          :data-id="board.id"
          @click="activateBoard($event)"
        >
          <div class="list-boards__text">{{ board.name }}</div>
          <div
            v-if="(showChangeButton || showDeleteButton) && Number(currentBoardId) === Number(board.id)"
            @click="openDropdownButtonList"
            class="list-boards__change-btn change-btn"
          >
            <img src="@/assets/img/pencil.svg" alt="изменить" />
          </div>
          <div class="list-boards__btn-group drop-btn-group">
            <button-change v-if="showChangeButton && Number(currentBoardId) === Number(board.id)" @click="changeBoard" />
            <button-rename v-if="showChangeButton && Number(currentBoardId) === Number(board.id)" @click="renameBoard" />
            <button-delete v-if="showDeleteButton && Number(currentBoardId) === Number(board.id)" @click="deleteBoard($event)" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="boardInfo" class="list-boards__board-info">
      <board-info :board-information="boardInfo" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'list-boards',

  data() {
    return {
      textStore: globalTextStore,
      showChangeButton: false,
      showDeleteButton: false,
    };
  },

  computed: {
    ...mapGetters({
      getUserId: 'userStore/userId',
      boardsList: 'taskStore/boardsList',
      currentBoardId: 'taskStore/currentBoardId',
      boardInfo: 'taskStore/boardInfo',
      userPermissions: 'userStore/userPermissions',
    }),
  },

  methods: {
    ...mapActions({
      getBoardsTaskList: 'taskStore/getBoardsTasks',
      changeCurrentBoardIdSync: 'taskStore/changeCurrentBoardIdSync',
      getColumnsTasks: 'taskStore/getColumnsTasks',
      changePopupType: 'popupData/getPopupType',
      changePopupTitle: 'popupData/getPopupTitle',
      getDeleteObject: 'popupData/getDeleteObject',
      getDeleteText: 'popupData/getDeleteText',
      openDropdownButtonList: 'popupData/openDropdownButtonList',
      getBoardsTasksInfo: 'taskStore/getBoardsTasksInfo',
      changeNameValueInput: 'popupData/getNameValueInput',
      changeDescriptionValueInput: 'popupData/getDescriptionValueInput',
      getUserPermissions: 'userStore/getUserPermissions',
    }),

    openPopupTodoList() {
      this.changePopupTitle('Create new board');
      this.changePopupType('createBoard');
    },
    changeBoard() {
      this.changePopupTitle('Change board');
      this.changePopupType('changeBoard');
      this.changeNameValueInput(this.boardInfo?.name);
      this.changeDescriptionValueInput(this.boardInfo?.description);
    },
    renameBoard() {
      this.changePopupTitle('Rename board');
      this.changePopupType('renameBoard');
      this.changeNameValueInput(this.boardInfo?.name);
    },

    deactivateBoards() {
      const allBoard = document.querySelectorAll('.list-boards__board');
      allBoard.forEach((board) => {
        board.classList = 'list-boards__board';
      });
    },

    checkAccess() {
      this.showChangeButton = this.userPermissions.includes('manage-board');
      this.showDeleteButton = this.userPermissions.includes('delete-board');
    },

    deleteBoard(event) {
      const dataObjectDelete = { data: {} };
      dataObjectDelete.type = 'board';
      dataObjectDelete.data.boardId = event.target.closest('.list-boards__board').dataset.id;
      dataObjectDelete.data.userId = this.getUserId;
      this.getDeleteObject(dataObjectDelete);
      this.getDeleteText(this.textStore.boardDeleteQuestionText);
    },

    async activateBoard(event) {
      if (event.target.closest('.list-boards__board_active')) return;
      this.deactivateBoards();
      const dataUser = {};
      event.target.closest('.list-boards__board').classList.add('list-boards__board_active');
      dataUser.boardId = event.target.closest('.list-boards__board').dataset.id;
      dataUser.userId = await this.getUserId;
      await this.changeCurrentBoardIdSync(dataUser.boardId);
      await this.getUserPermissions(dataUser);
      await this.checkAccess();
      await this.getColumnsTasks(dataUser);
      await this.getBoardsTasksInfo(dataUser);
    },
  },

  async created() {
    const dataUser = {};
    dataUser.userId = await this.$store.getters['userStore/userId'];
    await this.getBoardsTaskList(dataUser);
    if (this.responseServerError) {
      return;
    }
    if (this.boardsList.length < 1) return;
    dataUser.boardId = await this.boardsList[0].id;
    dataUser.userId = await this.getUserId;
    await this.getUserPermissions(dataUser);
    await this.$store.dispatch('taskStore/changeCurrentBoardIdSync', dataUser.boardId);
    const currentBoardIdState = await this.$store.getters['taskStore/currentBoardId'];
    const currentBoard = await document.querySelector(`.list-boards__board[data-id="${currentBoardIdState}"]`);
    await this.getColumnsTasks(dataUser);
    await this.checkAccess();

    if (document.querySelectorAll('.list-boards__board_active').length > 0) return;
    if (currentBoard) {
      currentBoard.classList.add('list-boards__board_active');
    }
  },

  async updated() {
    const dataUser = {};
    this.deactivateBoards();
    const currentBoardIdState = await this.$store.getters['taskStore/currentBoardId'];
    const currentBoard = document.querySelector(`.list-boards__board[data-id="${currentBoardIdState}"]`);
    const firstBoard = document.querySelector('.list-boards__board[data-number="0"]');

    if (!firstBoard) return;
    if (firstBoard.classList.contains('list-boards__board_active')) return;

    if (currentBoard) {
      currentBoard.classList.add('list-boards__board_active');
      return;
    }
    if (!currentBoard) {
      dataUser.boardId = firstBoard.dataset.id;
      await this.$store.dispatch('taskStore/changeCurrentBoardIdSync', dataUser.boardId);
      firstBoard.classList.add('list-boards__board_active');
      await this.getColumnsTasks(dataUser);
      dataUser.userId = await this.$store.getters['userStore/userId'];
      await this.getBoardsTasksInfo(dataUser);
    }
  },
};
</script>

<style scoped lang="scss"></style>
