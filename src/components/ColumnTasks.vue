<template>
  <div
    v-if="currentColumn"
    class="list-column__container"
    :data-create-data="currentColumn.createdAt"
    :id="currentColumn.id"
    :data-board-id="currentColumn.boardId"
    :data-value="currentColumn.name.toLowerCase().trim()"
  >
    <div class="list-column__header">
      <div class="list-column__title">
        {{ currentColumn.name }} (<span>{{ taskLength }}</span
        >)
      </div>
      <div class="list-column__btn-create-group">
        <div class="list-column__btn-add" @click="createTask($event)"><span>+</span>Add task</div>
        <div
          v-if="(showChangeButton || showDeleteButton) && Number(currentBoardId) === Number(currentColumn.boardId)"
          @click="openDropdownButtonList"
          class="list-column__change-btn change-btn"
        >
          <img src="@/assets/img/pencil.svg" alt="изменить" />
        </div>

        <div class="list-column__btn-group drop-btn-group">
          <button-change v-if="showChangeButton && Number(currentBoardId) === Number(currentColumn.boardId)" @click="changeColumn($event)" />
          <button-delete v-if="showDeleteButton && Number(currentBoardId) === Number(currentColumn.boardId)" @click="deleteColumn($event)" />
        </div>
      </div>
    </div>
    <div
      class="list-column__body"
      :class="`list-column__body-${currentColumn.id}`"
      :data-column-id="currentColumn.id"
      @dragover.prevent
      @dragenter.prevent="highlightDropArea($event)"
      @dragleave.prevent="unhighlightDropArea($event)"
      @drop="onDrop($event)"
    >
      <cards-task
        v-for="task in tasksData?.tasks"
        :key="task.id"
        :task="task"
        :column-id="currentColumn.id"
        @dragstart="startDrag($event, task)"
        @dragend="endDrag($event)"
        draggable="true"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CardsTask from '@/components/CardsTask.vue';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'column-tasks',
  components: {
    CardsTask,
  },
  props: {
    currentColumn: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      dataUser: {},
      tasksData: this.tasksList,
      taskLength: '',
      textStore: globalTextStore,
      boardIdDrop: '',
      showChangeButton: false,
      showDeleteButton: false,
    };
  },

  computed: {
    ...mapGetters({
      currentBoardId: 'taskStore/currentBoardId',
      tasksList: 'taskStore/tasksList',
      currentElementDataDrag: 'taskStore/currentElementDataDrag',
      responseError: 'taskStore/responseError',
      userPermissions: 'userStore/userPermissions',
    }),
  },

  watch: {
    tasksList: {
      immediate: false,
      handler() {
        this.tasksData = this.tasksList.find((element) => {
          return element.status.id === this.currentColumn.id;
        });
        this.taskLength = this.tasksData?.tasks?.length;
      },
    },
  },

  methods: {
    ...mapActions({
      getTask: 'taskStore/getTask',
      getDeleteObject: 'popupData/getDeleteObject',
      getDeleteText: 'popupData/getDeleteText',
      changeCurrentElementDataDragSync: 'taskStore/changeCurrentElementDataDragSync',
      changePopupType: 'popupData/getPopupType',
      changePopupTitle: 'popupData/getPopupTitle',
      openDropdownButtonList: 'popupData/openDropdownButtonList',
      changeCurrentColumnIdSync: 'taskStore/changeCurrentColumnIdSync',
      changeNameValueInput: 'popupData/getNameValueInput',
      changeTaskColumnId: 'taskStore/changeTaskColumnId',
      changeTasksListSync: 'taskStore/changeTasksListSync',
      getColumnsTasks: 'taskStore/getColumnsTasks',
    }),

    checkAccess() {
      this.showChangeButton = this.userPermissions.includes('manage-board-statuses');
      this.showDeleteButton = this.userPermissions.includes('delete-board-statuses');
    },

    createTask(event) {
      this.changeCurrentColumnIdSync(event.target.closest('.list-column__container').id);
      this.changePopupTitle('Create new task');
      this.changePopupType('createTask');
    },

    changeColumn(event) {
      this.changeCurrentColumnIdSync(event.target.closest('.list-column__container').id);
      this.changePopupTitle('Change column');
      this.changePopupType('changeColumn');
      this.changeNameValueInput(this.currentColumn.name);
    },

    deleteColumn(event) {
      const dataObjectDelete = { data: {} };
      dataObjectDelete.type = 'column';
      dataObjectDelete.data.boardId = event.target.closest('.list-column__container').dataset.boardId;
      dataObjectDelete.data.columnId = event.target.closest('.list-column__container').id;
      dataObjectDelete.data.userId = this.getUserId;
      this.getDeleteObject(dataObjectDelete);
      this.getDeleteText(this.textStore.columnDeleteQuestionText);
    },

    updateColumnData(taskNew, columnIdNew) {
      const taskId = taskNew.id;
      let tasks;
      let taskIndex;
      let taskSplice;

      const oldIndexColumn = this.tasksList.findIndex((column) => {
        return column.tasks.some((task) => task.id === taskId);
      });
      const newIndexColumn = this.tasksList.findIndex((column) => {
        return Number(column.status.id) === Number(columnIdNew);
      });

      if (oldIndexColumn !== -1) {
        tasks = this.tasksList[oldIndexColumn].tasks;
        taskIndex = tasks.findIndex((task) => task.id === taskId);
      }
      if (taskIndex !== -1 && oldIndexColumn !== -1) {
        this.tasksList[oldIndexColumn].tasks[taskIndex].statusId = columnIdNew;
        taskSplice = this.tasksList[oldIndexColumn].tasks.splice(taskIndex, 1)[0];
      }
      if (this.tasksList[newIndexColumn].tasks) {
        this.tasksList[newIndexColumn].tasks.push(taskSplice);
      }

      this.changeTasksListSync(this.tasksList);
      this.$forceUpdate();
    },

    startDrag(event, task) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      this.changeCurrentElementDataDragSync(task);
    },

    async onDrop(event) {
      event.preventDefault();
      if (event.target.closest('.card-task')) return;
      if (event.target.closest('.list-column__body')) {
        const columnIdNew = event.target.dataset.columnId;
        const task = this.currentElementDataDrag;
        await this.changeTaskColumnId({ boardId: task.boardId, taskId: task.id, columnId: columnIdNew });

        if (this.responseError) return;

        await this.updateColumnData(task, columnIdNew);
        await this.getTask({ boardId: task.boardId });
        await this.getColumnsTasks({ boardId: task.boardId });
        this.tasksData = this.$store.getters['taskStore/tasksList'].find((element) => {
          return element.status.id === this.currentColumn.id;
        });
        this.taskLength = this.tasksData?.tasks?.length;
      }
    },

    endDrag() {
      if (document.querySelector('.highlighted-drop-area')) {
        document.querySelector('.highlighted-drop-area').classList.remove('highlighted-drop-area');
      }
    },

    highlightDropArea(event) {
      event.target.classList.add('highlighted-drop-area');
    },

    unhighlightDropArea(event) {
      event.target.classList.remove('highlighted-drop-area');
    },
  },

  async created() {
    if (this.currentBoardId) {
      this.dataUser.boardId = await this.currentBoardId;
      await this.getTask(this.dataUser);
      this.tasksData = await this.tasksList.find((element) => {
        return element.status.id === this.currentColumn.id;
      });
      this.taskLength = await this.tasksData?.tasks?.length;
      this.checkAccess();
    }
  },
};
</script>

<style scoped lang="scss">
.highlighted-drop-area {
  border: 2px dotted var(--dropDown-shadow-green-color);
}
</style>
