<template>
  <div
    v-if="task && task?.statusId === columnId"
    class="card-task"
    :class="'card-task-' + task.id"
    :id="task.id"
    :data-column-id="task.statusId"
    :data-board-id="task.boardId"
  >
    <div class="card-task__container">
      <div class="card-task__progress-text-group">
        <div class="card-task__title-group">
          <h2 class="card-task__title">{{ task.name }}</h2>
          <div @click="openDropdownButtonList" class="card-task__change-btn change-btn"><img src="@/assets/img/pencil.svg" alt="изменить" /></div>
          <div class="card-task__btn-group drop-btn-group">
            <button-change @click="changeTask($event)" />
            <button-delete @click="deleteTask($event)" />
          </div>
        </div>

        <p class="card-task__description">{{ task.description }}</p>
      </div>
      <div class="card-task__progress-info-group">
        <div class="card-task__progress-info">
          <div class="card-task__progress-btn"><img src="./icons/progress-list.svg" alt="Комментарии" /> Progress</div>
        </div>
        <div class="card-task__progress-line">
          <div class="card-task__progress-slider"></div>
        </div>
      </div>
      <div class="card-task__footer-card">
        <div v-if="task.plannedCompletionAt" class="card-task__date" :class="deadlineRelevanceClass(task.plannedCompletionAt)">
          {{ formattedDate(task.plannedCompletionAt) }}
        </div>
        <div v-if="!task.plannedCompletionAt" class="card-task__date">{{ textStore.oldDateMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formattingDate, getDeadlineRelevanceClass } from '@/utils/utils.js';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'cards-task',
  props: {
    task: {
      type: Object,
      default: () => {},
    },
    columnId: {
      type: Number,
    },
  },

  data() {
    return {
      formattedDate: formattingDate,
      deadlineRelevanceClass: getDeadlineRelevanceClass,
      textStore: globalTextStore,
    };
  },
  computed: {
    ...mapGetters({
      currentBoardId: 'taskStore/currentBoardId',
    }),
  },

  methods: {
    ...mapActions({
      getTask: 'taskStore/getTask',
      getDeleteObject: 'popupData/getDeleteObject',
      getDeleteText: 'popupData/getDeleteText',
      changePopupType: 'popupData/getPopupType',
      changePopupTitle: 'popupData/getPopupTitle',
      openDropdownButtonList: 'popupData/openDropdownButtonList',
      changeCurrentColumnIdSync: 'taskStore/changeCurrentColumnIdSync',
      changeCurrentTaskIdSync: 'taskStore/changeCurrentTaskIdSync',
      changeNameValueInput: 'popupData/getNameValueInput',
      changeDescriptionValueInput: 'popupData/getDescriptionValueInput',
      changeDateValueInput: 'popupData/getDateValueInput',
    }),

    changeTask(event) {
      this.changeCurrentColumnIdSync(event.target.closest('.card-task').dataset.columnId);
      this.changeCurrentTaskIdSync(event.target.closest('.card-task').id);
      this.changePopupTitle('Change task');
      this.changePopupType('changeTask');

      this.changeNameValueInput(this.task.name);
      this.changeDescriptionValueInput(this.task.description);
      this.changeDateValueInput(this.task.plannedCompletionAt);
    },

    deleteTask(event) {
      const dataObjectDelete = { data: {} };
      dataObjectDelete.type = 'task';
      dataObjectDelete.data.taskId = event.target.closest('.card-task').id;
      dataObjectDelete.data.boardId = event.target.closest('.card-task').dataset.boardId;
      this.getDeleteObject(dataObjectDelete);
      this.getDeleteText(this.textStore.taskDeleteQuestionText);
    },
  },

  async created() {
    if (this.currentBoardId) {
      await this.getTask({ boardId: this.currentBoardId });
    }
  },
};
</script>

<style scoped lang="scss"></style>
