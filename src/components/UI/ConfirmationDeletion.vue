<template>
  <section v-if="deleteText" class="confirmation-deletion-popup">
    <div class="confirmation-deletion-popup__container">
      <div class="confirmation-deletion-popup__title">Подтвердите удаление</div>
      <div class="confirmation-deletion-popup__message">{{ deleteText }}</div>
      <div class="confirmation-deletion-popup__btn-group">
        <div class="confirmation-deletion-popup__delete-btn" @click="deleteElement">YES</div>
        <div class="confirmation-deletion-popup__delete-btn" @click="exitPopupDelete">NO</div>
      </div>
      <div v-if="errorText || responseServerError" class="confirmation-deletion-popup__error-text-block">
        Удаление не возможно! <br />{{ errorText ? errorText : responseServerError }}
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'confirmation-deletion',

  data() {
    return {
      textStore: globalTextStore,
    };
  },
  computed: {
    ...mapGetters({
      deleteText: 'popupData/deleteText',
      errorText: 'popupData/errorBtnPopup',
      responseServerError: 'taskStore/responseError',
      deleteObject: 'popupData/deleteObject',
    }),
  },
  methods: {
    ...mapActions({
      changeDeleteText: 'popupData/getDeleteText',
      changeError: 'popupData/getError',
      changeErrorPopup: 'taskStore/changeResponseErrorSync',
      changeDeleteObject: 'popupData/getDeleteObject',
      changeAlertText: 'popupData/getAlertText',

      getBoardsTasks: 'taskStore/getBoardsTasks',
      getColumnsTasks: 'taskStore/getColumnsTasks',
      getTask: 'taskStore/getTask',
      changeColumnsListSync: 'taskStore/changeColumnsListSync',
      deleteBoardTasks: 'taskStore/deleteBoardTasks',
      deleteColumnTasks: 'taskStore/deleteColumnTasks',
      deleteTask: 'taskStore/deleteTask',
    }),

    exitPopupDelete() {
      const activeDropDownList = document.querySelector('.drop-btn-group_visible')
      if (activeDropDownList) {
        activeDropDownList.classList.remove('drop-btn-group_visible')
      }
      this.changeDeleteText('');
      this.changeError('');
      this.changeErrorPopup('');
      this.changeDeleteObject('');
    },

    async deleteElement() {
      if (!this.deleteObject.type) return;

      if (this.deleteObject.type === 'board') {
        await this.deleteBoardTasks(this.deleteObject.data);
        if (!this.responseServerError) {
          await this.getBoardsTasks(this.deleteObject.data);
          await this.changeAlertText(this.textStore.boardDeleteText);
          setTimeout(() => {
            this.exitPopupDelete();
          }, 1500);
        }
        return;
      }
      if (this.deleteObject.type === 'column') {
        await this.deleteColumnTasks(this.deleteObject.data);
        if (!this.responseServerError) {
          await this.getColumnsTasks(this.deleteObject.data);
          await this.changeAlertText(this.textStore.columnDeleteText);
          setTimeout(() => {
            this.exitPopupDelete();
          }, 1500);
        }
        return;
      }
      if (this.deleteObject.type === 'task') {
        await this.deleteTask(this.deleteObject.data);
        if (!this.responseServerError) {
          await this.getColumnsTasks(this.deleteObject.data);
          await this.getTask(this.deleteObject.data);
          await this.changeAlertText(this.textStore.taskDeleteText);
          setTimeout(() => {
            this.exitPopupDelete();
          }, 1500);
        }
        return;
      }
    },
  },
};
</script>

<style></style>
