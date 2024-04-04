<template>
  <div class="checkbox" @click="toggleCheckbox($event)" :data-name="dataSettings" :data-type="typeSettings" :id="idBoard">
    <input type="checkbox" :data-name="dataSettings" :checked="isActive" class="checkbox__hidden" :id="dataSettings + '-' + idBoard" />
    <div class="checkbox__slider"></div>
    <label :for="dataSettings + '-' + idBoard" class="checkbox__label">
      <span class="checkbox__text">{{ labelValue }}</span>
    </label>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'button-checkbox',
  props: {
    dataSettings: {
      type: String,
    },
    typeSettings: {
      type: String,
    },
    labelValue: {
      type: String,
    },
    permission: {
      type: Array,
    },
    idBoard: {
      type: String,
    },
    boardData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentCheckboxIdBoardSettings: '',
      isActive: false,
    };
  },
  computed: {
    ...mapGetters({
      userEmail: 'userStore/userEmail',
      currentUserSettings: 'userStore/currentUserSettings',
      currentBoardSettings: 'taskStore/currentBoardSettings',
    }),
  },
  watch: {
    permission: function (newVal, oldVal) {
      const authorizedUserEmail = this.userEmail.toLowerCase();
      const ownerBoardEmail = this.boardData.owner.email.toLowerCase();

      if (newVal === oldVal) return;

      if (this.$el.dataset.type === 'board' && this.idBoard === this.$el.id && ownerBoardEmail === authorizedUserEmail) {
        this.displayingCheckboxActivity();
        return;
      }

      if (this.$el.dataset.type === 'user' && this.currentUserSettings.dataBoard === this.$el.id && ownerBoardEmail === authorizedUserEmail) {
        this.displayingCheckboxActivity();
        return;
      }
    },
  },
  methods: {
    ...mapActions({
      assigningPermissionBoardUser: 'userStore/assigningPermissionBoardUser',
      deletePermissionBoardUser: 'userStore/deletePermissionBoardUser',
    }),

    displayingCheckboxActivity() {
      const arrPermission = Object.values(this.permission);
      const dataNameCheckboxBlock = this.$el.dataset.name;
      this.isActive = arrPermission.includes(dataNameCheckboxBlock);
    },

    toggleCheckbox(event) {
      const currentCheckbox = event.target.closest('.checkbox');
      const data = {};
      data.userId = this.currentUserSettings.idUser;
      data.boardId = this.boardData.id;
      data.permission = currentCheckbox.dataset.name;

      this.isActive = !this.isActive;
      this.$emit('update:isActive', !this.isActive);
      if (this.isActive) {
        this.assigningPermissionBoardUser(data);
        return;
      }
      if (!this.isActive) {
        this.deletePermissionBoardUser(data);
        return;
      }
    },
  },
};
</script>
