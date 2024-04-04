<template>
  <div class="user-accesses-card" :data-user-id="usersBoard.id" @click="visibleAccessesSettings($event)">
    <div class="user-accesses-card__data-group">
      <p class="user-accesses-card__data">User name: {{ usersBoard.name }}</p>
      <p class="user-accesses-card__data">User email: {{ usersBoard.email }}</p>
    </div>
    <div class="user-accesses-card__btn-group">
      <div class="user-accesses-card__btn-group-text" v-if="usersBoard.email === boardInformation.owner.email">Creator</div>
      <div
        v-if="userEmail.toLowerCase() === boardInformation.owner.email.toLowerCase() && usersBoard.email !== boardInformation.owner.email"
        class="user-accesses-card__btn user-accesses-card__btn-accesses"
      >
        Accesses
      </div>
      <div
        v-if="
          (userEmail.toLowerCase() === boardInformation.owner.email.toLowerCase() && usersBoard.email !== boardInformation.owner.email) ||
          (manageBoardUsers && usersBoard.email !== boardInformation.owner.email)
        "
        class="user-accesses-card__btn user-accesses-card__btn-delete"
        @click="deleteBoardUserFn($event)"
      >
        Delete
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'user-accesses',
  props: {
    usersBoard: {
      type: Object,
    },
    boardInformation: {
      type: Object,
      default: () => {},
    },
    manageBoardUsers: {
      type: Boolean,
    },
  },
  data() {
    return {
      authorizedUser: '',
      data: '',
    };
  },

  computed: {
    ...mapGetters({
      userEmail: 'userStore/userEmail',
      userPermissions: 'userStore/userPermissions',
      currentUserSettings: 'userStore/currentUserSettings',
      errorBtnPopup: 'popupData/errorBtnPopup',

      usersBoardsList: 'userStore/usersBoardsList',
    }),
  },

  methods: {
    ...mapActions({
      getUserPermissions: 'userStore/getUserPermissions',
      changeCurrentUserSettings: 'userStore/changeCurrentUserSettings',
      deleteBoardUser: 'userStore/deleteBoardUser',
      getListUsersBoards: 'userStore/getListUsersBoards',
      changeCurrentBoardListIdSync: 'userStore/changeCurrentBoardListIdSync',
    }),

    activateCardUser(userCard) {
      const allActiveUserCard = document.querySelectorAll('.user-accesses-card_active');
      allActiveUserCard.forEach((card) => card.classList.remove('user-accesses-card_active'));
      userCard.classList.add('user-accesses-card_active');
    },

    async deleteBoardUserFn(event) {
      const userCard = event.target.closest('.user-accesses-card');
      const data = {};
      data.userId = Number(userCard.dataset.userId);
      data.boardId = Number(this.boardInformation.id);

      await this.changeCurrentBoardListIdSync(Number(this.boardInformation.id));
      await this.deleteBoardUser(data);
      await this.getListUsersBoards(data);
    },

    async visibleAccessesSettings(event) {
      const data = {};
      const userCard = event.target.closest('.user-accesses-card');
      const parentCardSettings = event.target.closest('.administration');
      const userId = userCard.dataset.userId;
      const boardId = parentCardSettings.dataset.boardId;
      const accessesBlock = parentCardSettings.querySelector('.settings-accesses');
      const allAccessesBlock = document.querySelectorAll('.board-administration__settings-users');

      data.userId = userId;
      data.boardId = boardId;
      await this.changeCurrentUserSettings({ idUser: userId, dataBoard: 'user-' + boardId });
      await this.activateCardUser(userCard);

      allAccessesBlock.forEach((block) => {
        block.classList.remove('settings-accesses_active');
      });

      if (this.userEmail.toLowerCase() === this.boardInformation.owner.email.toLowerCase() && userCard) {
        await this.getUserPermissions(data);
      }

      if (
        this.userEmail.toLowerCase() === this.boardInformation.owner.email.toLowerCase() &&
        event.target.closest('.user-accesses-card__btn-accesses')
      ) {
        await this.getUserPermissions(data);
        accessesBlock.classList.add('settings-accesses_active');
      }
    },
  },
};
</script>

<style lang="scss"></style>
