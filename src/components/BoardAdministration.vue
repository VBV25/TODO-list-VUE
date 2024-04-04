<template>
  <div v-if="boardData" class="board-administration__card">
    <div class="board-administration__board-settings-wrapper" :data-board-id="boardData.id">
      <board-info class="board-administration__info" :board-information="boardData" />
      <div v-if="settingsListBoard" class="board-administration__settings-boards settings-accesses">
        <div class="settings-accesses__title-group">
          <h2 class="settings-accesses__title">Accesses</h2>
          <button class="settings-accesses__btn-save">Close</button>
        </div>
        <button-checkbox
          v-for="(text, setting) in settingsListBoard"
          :data-settings="setting"
          :label-value="text"
          :permission="permissionBoard"
          :id-board="'board-' + boardData.id"
          :board-data="boardData"
          :type-settings="'board'"
        />
      </div>
    </div>
    <div class="board-administration__administration administration" :data-board-id="boardData.id">
      <div class="administration__info">
        <div class="administration__title-group">
          <h2 class="administration__title">Use board people</h2>
          <div v-if="manageBoardUsers" class="administration__add-user">
            <email-input v-model="emailUser" placeholder="Enter email user" :board-id="boardData.id" @click="activateDropdownList($event)" />
            <button class="administration__btn administration__btn-add" @click="addNewUserBoard">Add user</button>

            <div v-if="foundListUsers.length > 0" class="administration__possible-users-list" :board-id="boardData.id">
              <div class="administration__close-dropdown-btn" @click="clearFields">Close</div>
              <div class="administration__possible-users-wrapper">
                <div v-for="user in foundListUsers" class="administration__possible-user" @click="selectUser($event)" :data-user-id="user.id">
                  {{ user.email }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="administration__user-list">
          <user-accesses v-for="user in usersBoardData" :users-board="user" :board-information="boardData" :manage-board-users="manageBoardUsers" />
        </div>
      </div>
      <div v-if="settingsListUser" class="board-administration__settings-users settings-accesses">
        <div class="settings-accesses__title-group">
          <h2 class="settings-accesses__title">Accesses</h2>
          <button class="settings-accesses__btn-save" @click="closeUserPermissions($event)">Close</button>
        </div>
        <div v-if="userEmail.toLowerCase() === boardData.owner.email.toLowerCase()" class="settings-accesses__button-checkbox-wrapper">
          <button-checkbox
            v-for="(text, setting) in settingsListUser"
            :data-settings="setting"
            :label-value="text"
            :permission="permissionUser"
            :id-board="'user-' + boardData.id"
            :board-data="boardData"
            :type-settings="'user'"
          />
        </div>
        <div v-else class="settings-accesses__not-enough-rights">Not enough rights</div>
      </div>
    </div>
  </div>
  <error-popup />
</template>

<script>
import { permissionListBoard, permissionListUser } from '@/utils/utils.js';
import globalTextStore from '@/utils/textStore.js';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'board-administration',
  props: {
    boardData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      textStore: globalTextStore,
      emailUser: '',
      permissionBoard: this.boardPermissions,
      permissionUser: this.userPermissions,
      usersBoardData: {},
      settingsListBoard: permissionListBoard,
      settingsListUser: permissionListUser,
      manageBoardUsers: '',
      arrNewUserId: [],
      dataAddNewUser: {},
      activeEmailInputId: '',
      currentBoardId: '',
      boardListId: '',
    };
  },

  computed: {
    ...mapGetters({
      usersBoardsList: 'userStore/usersBoardsList',
      boardPermissions: 'taskStore/boardPermissions',
      userPermissions: 'userStore/userPermissions',
      currentBoardSettings: 'taskStore/currentBoardSettings',
      userEmail: 'userStore/userEmail',
      userId: 'userStore/userId',
      foundListUsers: 'userStore/foundListUsers',
      errorBtnPopup: 'popupData/errorBtnPopup',
      currentBoardListId: 'userStore/currentBoardListId',
    }),
  },
  watch: {
    userPermissions: function () {
      this.permissionUser = this.userPermissions;
    },
    boardPermissions: function () {
      this.permissionBoard = this.boardPermissions;
    },
    currentBoardListId: function () {
      this.boardListId = this.currentBoardListId;
    },
    usersBoardsList: function (newVal, oldVal) {
      if (newVal !== oldVal && this.boardListId === this.boardData.id) {
        this.usersBoardData = this.usersBoardsList;
      }
    },
  },
  methods: {
    ...mapActions({
      getListUsersBoards: 'userStore/getListUsersBoards',
      getBoardPermissions: 'taskStore/getBoardPermissions',
      getUserPermissions: 'userStore/getUserPermissions',
      changeFoundListUsersSync: 'userStore/changeFoundListUsersSync',
      addUserBoard: 'userStore/addUserBoard',
      changeError: 'popupData/getError',
      changeCurrentBoardListIdSync: 'userStore/changeCurrentBoardListIdSync',
    }),

    closeUserPermissions(event) {
      const currentAccessesBlock = event.target.closest('.settings-accesses_active');
      currentAccessesBlock.classList.remove('settings-accesses_active');
    },

    selectUser(event) {
      const selectedNewUser = event.target.closest('.administration__possible-user');
      const selectedNewUserId = selectedNewUser.dataset.userId;
      const currentAddUserBlock = event.target.closest('.administration__add-user_current');

      if (this.arrNewUserId.includes(selectedNewUserId) && selectedNewUser.classList.contains('administration__possible-user_active')) {
        selectedNewUser.classList.remove('administration__possible-user_active');
        this.arrNewUserId = this.arrNewUserId.filter((userId) => userId !== selectedNewUserId);
        if (this.arrNewUserId.length === 0) {
          currentAddUserBlock.querySelector('.administration__btn-add').classList.remove('administration__btn-add_active');
        }
        return;
      }

      if (!this.arrNewUserId.includes(selectedNewUserId) && !selectedNewUser.classList.contains('administration__possible-user_active')) {
        selectedNewUser.classList.add('administration__possible-user_active');
        this.arrNewUserId.push(selectedNewUserId);
        if (this.arrNewUserId.length > 0) {
          currentAddUserBlock.querySelector('.administration__btn-add').classList.add('administration__btn-add_active');
        }
        return;
      }
    },

    clearFields() {
      this.dataAddNewUser = {};
      this.arrNewUserId = [];
      this.emailUser = '';
      this.changeFoundListUsersSync('');
      document.querySelectorAll('.email-input').forEach((input) => {
        input.value = '';
      });
    },

    async addNewUserBoard() {
      this.dataAddNewUser.arrNewUsersBoard = this.arrNewUserId;
      this.dataAddNewUser.boardId = this.currentBoardId;
      if (this.dataAddNewUser.arrNewUsersBoard.length < 1) {
        await this.changeError(this.textStore.notNewUsersBoard);
        return;
      }

      await this.changeCurrentBoardListIdSync(Number(this.currentBoardId));
      await this.addUserBoard(this.dataAddNewUser);
      await this.getListUsersBoards(this.dataAddNewUser);

      await this.clearFields();
      document.querySelectorAll('.administration__possible-user_active').forEach((activeNewUser) => {
        activeNewUser.classList.remove('administration__possible-user_active');
      });
    },

    activateDropdownList(event) {
      if (event.target.closest('.email-input') && !event.target.closest('.administration__add-user_current')) {
        const parentInputEmail = event.target.closest('.administration__add-user');
        this.currentBoardId = event.target.closest('.administration').dataset.boardId;
        this.clearFields();
        document
          .querySelectorAll('.administration__add-user_current')
          .forEach((blockActive) => blockActive.classList.remove('administration__add-user_current'));
        parentInputEmail.classList.add('administration__add-user_current');
      }
    },
  },

  async mounted() {
    const authorizedUserEmail = this.userEmail.toLowerCase();
    const data = {};
    data.userId = this.userId;
    data.boardId = this.boardData.id;
    await this.getListUsersBoards(data);
    this.usersBoardData = (await this.usersBoardsList) ? this.usersBoardsList : [];

    if (authorizedUserEmail === this.boardData.owner.email.toLowerCase()) {
      await this.getBoardPermissions(data);
      this.permissionBoard = await this.boardPermissions;
    }
    await this.getUserPermissions(data);
    const arrPermission = await this.userPermissions;
    this.manageBoardUsers = await arrPermission.includes('manage-board-users');
  },
};
</script>
