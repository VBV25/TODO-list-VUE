<template>
  <section v-if="popupTitle" class="popup">
    <div class="popup__content">
      <exit-popup @click="closePopup" />
      <div class="popup__title-row">
        <div class="popup__title">{{ popupTitle }}</div>
        <div class="popup__description">{{ textStore.popupDescriptionText }}</div>
      </div>

      <div class="popup__block-inserting-elements">
        <date-input v-if="popupType === 'createTask' || popupType === 'changeTask'" v-model="dateValue" />

        <label class="input-label">
          Name:
          <text-input v-model="nameValue" placeholder="Enter name" :model-type="'name'" />
        </label>

        <label
          v-if="popupType === 'createBoard' || popupType === 'createTask' || popupType === 'changeBoard' || popupType === 'changeTask'"
          class="input-label"
        >
          Description:
          <textarea-input v-model="descriptionValue" placeholder="Enter description" />
        </label>
      </div>
      <button-popup @click="createElementsTodoList" />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ExitPopup from '@/components/UI/ExitPopup.vue';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'popup-todo-list',
  components: {
    ExitPopup,
  },

  data() {
    return {
      nameValue: '',
      descriptionValue: '',
      dateValue: '',
      textStore: globalTextStore,
    };
  },

  computed: {
    ...mapGetters({
      errorText: 'popupData/errorBtnPopup',
      responseServerError: 'taskStore/responseError',
      popupType: 'popupData/popupType',
      popupTitle: 'popupData/popupTitle',
      userId: 'userStore/userId',
      currentBoardId: 'taskStore/currentBoardId',
      currentColumnId: 'taskStore/currentColumnId',
      currentTaskId: 'taskStore/currentTaskId',
      responseTrue: 'taskStore/responseTrue',
    }),
  },

  methods: {
    ...mapActions({
      changeAlertText: 'popupData/getAlertText',
      changeError: 'popupData/getError',
      changeErrorPopup: 'taskStore/changeResponseErrorSync',
      changePopupType: 'popupData/getPopupType',
      changePopupTitle: 'popupData/getPopupTitle',
      changeNameValueInput: 'popupData/getNameValueInput',
      changeDescriptionValueInput: 'popupData/getDescriptionValueInput',
      changeDateValueInput: 'popupData/getDateValueInput',

      createBoardTasks: 'taskStore/createBoardTasks',
      createColumnTasks: 'taskStore/createColumnTasks',
      createTask: 'taskStore/createTask',
      getBoardsTasks: 'taskStore/getBoardsTasks',
      getBoardsTasksInfo: 'taskStore/getBoardsTasksInfo',
      getColumnsTasks: 'taskStore/getColumnsTasks',
      editBoardTasks: 'taskStore/editBoardTasks',
      editColumnTasks: 'taskStore/editColumnTasks',
      renameBoardTasks: 'taskStore/renameBoardTasks',
      changeTask: 'taskStore/changeTask',
      getTask: 'taskStore/getTask',
    }),

    async closePopup() {
      const activeDropDownList = document.querySelector('.drop-btn-group_visible');

      this.changePopupType('');
      this.changePopupTitle('');
      this.changeNameValueInput('');
      this.changeDescriptionValueInput('');
      this.changeDateValueInput('');
      this.nameValue = '';
      this.descriptionValue = '';
      this.dateValue = '';
      this.changeError('');
      this.changeErrorPopup('');

      this.getBoardsTasks({ userId: this.userId });
      this.getColumnsTasks({ boardId: this.currentBoardId });
      this.getBoardsTasksInfo({ userId: this.userId, boardId: this.currentBoardId });

      if (this.currentBoardId) {
        await this.getTask({ boardId: this.currentBoardId });
      }
      if (activeDropDownList) {
        activeDropDownList.classList.remove('drop-btn-group_visible');
      }
      setTimeout(() => {
        this.changeAlertText('');
      }, 2600);
    },

    validationName() {
      if (!this.nameValue || this.nameValue.length < 5) {
        return this.textStore.nameInputValueErr;
      }
      if (this.nameValue && this.nameValue.length > 4) {
        return;
      }
    },

    validationDescription() {
      if (!this.descriptionValue || this.descriptionValue.length < 5) {
        return this.textStore.descriptionInputValueErr;
      }
      if (this.descriptionValue && this.descriptionValue.length > 4) {
        return;
      }
    },

    validationDate() {
      if (!this.dateValue) {
        return this.textStore.dateInputValueErr;
      } else {
        return;
      }
    },

    async createElementsTodoList() {
      const nameValid = this.validationName();
      const descriptionValid = this.validationDescription();
      const dateValid = this.validationDate();
      const nameAndDescriptionValidation = !nameValid && !descriptionValid;
      const nameInputVisible = this.popupType === 'createTaskColumn' || this.popupType === 'renameBoard' || this.popupType === 'changeColumn';
      const nameAndDescriptionInputVisible = this.popupType === 'createBoard' || this.popupType === 'changeBoard';
      const nameAndDescriptionAndDateInputVisible = this.popupType === 'createTask' || this.popupType === 'changeTask';

      const data = {
        userId: this.userId,
        boardId: this.currentBoardId,
        columnId: this.currentColumnId,
        taskId: this.currentTaskId,
        name: this.nameValue,
        description: this.descriptionValue,
        date: this.dateValue,
      };

      //--name and description--
      if (nameAndDescriptionInputVisible && nameValid) {
        await this.changeError(nameValid);
        return;
      }
      if (nameAndDescriptionInputVisible && descriptionValid) {
        await this.changeError(descriptionValid);
        return;
      }

      if (this.popupType === 'createBoard' && nameAndDescriptionValidation) {
        await this.createBoardTasks(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.boardCreatedText);
          await this.closePopup();
        }
        return;
      }

      if (this.popupType === 'changeBoard' && nameAndDescriptionValidation) {
        await this.editBoardTasks(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.boardChangedText);
          await this.closePopup();
        }
        return;
      }

      //--name--
      if (nameInputVisible && nameValid) {
        await this.changeError(nameValid);
        return;
      }

      if (this.popupType === 'createTaskColumn' && !nameValid) {
        await this.createColumnTasks(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.columnCreateText);
          await this.closePopup();
        }
        return;
      }

      if (this.popupType === 'renameBoard' && !nameValid) {
        await this.renameBoardTasks(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.boardRenameText);
          await this.closePopup();
        }
        return;
      }

      if (this.popupType === 'changeColumn' && !nameValid) {
        await this.editColumnTasks(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.boardRenameText);
          await this.closePopup();
        }
        return;
      }
      //--name end description and date--

      if (nameAndDescriptionAndDateInputVisible && nameValid) {
        this.changeError(nameValid);
        return;
      }

      if (nameAndDescriptionAndDateInputVisible && descriptionValid) {
        this.changeError(descriptionValid);
        return;
      }

      if (nameAndDescriptionAndDateInputVisible && dateValid) {
        this.changeError(dateValid);
        return;
      }

      if (this.popupType === 'createTask' && nameAndDescriptionValidation && !dateValid) {
        await this.createTask(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.taskCreateText);
          await this.closePopup();
        }
        return;
      }
      if (this.popupType === 'changeTask' && nameAndDescriptionValidation && !dateValid) {
        await this.changeTask(data);
        if (!this.errorText && !this.responseServerError) {
          await this.changeError('');
          await this.changeAlertText(this.textStore.taskChangedText);
          await this.closePopup();
        }
        return;
      }
    },
  },
};
</script>

<style lang="scss"></style>
