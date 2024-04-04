import axios from '@/utils/axios.config.js';

const tasksListModule = {
  namespaced: true,
  state: {
    boardsList: '',
    currentBoardId: '',
    boardInfo: '',
    columnsList: '',
    currentColumnId: '',
    tasksList: '',
    currentTaskId: '',
    boardPermissions: '',
    responseError: '',
    responseTrue: '',
    currentBoardSettings: '',
    currentElementDataDrag: null,
  },
  getters: {
    boardsList: (state) => state.boardsList,
    currentBoardId: (state) => state.currentBoardId,
    boardInfo: (state) => state.boardInfo,
    columnsList: (state) => state.columnsList,
    currentColumnId: (state) => state.currentColumnId,
    currentTaskId: (state) => state.currentTaskId,
    tasksList: (state) => state.tasksList,
    boardPermissions: (state) => state.boardPermissions,
    responseError: (state) => state.responseError,
    responseTrue: (state) => state.responseTrue,
    currentBoardSettings: (state) => state.currentBoardSettings,
    currentElementDataDrag: (state) => state.currentElementDataDrag
  },
  mutations: {
    changeBoardsList(state, newBoardsList) {
      state.boardsList = newBoardsList;
    },
    changeCurrentElementDataDrag(state, newCurrentElementDataDrag) {
      state.currentElementDataDrag = newCurrentElementDataDrag;
    },
    changeCurrentBoardId(state, newCurrentBoardId) {
      state.currentBoardId = newCurrentBoardId;
    },
    changeBoardInfo(state, newBoardInfo) {
      state.boardInfo = newBoardInfo;
    },
    changeColumnsList(state, newColumnsList) {
      state.columnsList = newColumnsList;
    },
    changeCurrentColumnId(state, newCurrentColumnId) {
      state.currentColumnId = newCurrentColumnId;
    },
    changeCurrentTaskId(state, newCurrentTaskId) {
      state.currentTaskId = newCurrentTaskId;
    },
    changeTasksList(state, newTasksList) {
      state.tasksList = newTasksList;
    },
    changeBoardPermissions(state, newBoardPermissions) {
      state.boardPermissions = newBoardPermissions;
    },
    changeResponseError(state, newResponseError) {
      state.responseError = newResponseError;
    },
    changeResponseTrue(state, newResponseTrue) {
      state.responseTrue = newResponseTrue;
    },
    changeCurrentBoardSettings(state, newCurrentBoardSettings) {
      state.currentBoardSettings = newCurrentBoardSettings;
    },
  },
  actions: {
    changeResponseTrueSync({ commit }, text) {
      commit('changeResponseTrue', text);
    },
    changeCurrentElementDataDragSync({ commit }, text) {
      commit('changeCurrentElementDataDrag', text);
    },
    changeResponseErrorSync({ commit }, text) {
      commit('changeResponseError', text);
    },
    changeCurrentBoardIdSync({ commit }, id) {
      commit('changeCurrentBoardId', id);
    },
    changeCurrentTaskIdSync({ commit }, id) {
      commit('changeCurrentTaskId', id);
    },
    changeCurrentColumnIdSync({ commit }, id) {
      commit('changeCurrentColumnId', id);
    },
    changeColumnsListSync({ commit }, data) {
      commit('changeColumnsList', data);
    },
    changeBoardInfoSync({ commit }, data) {
      commit('changeBoardInfo', data);
    },
    changeBoardInfoSync({ commit }, data) {
      commit('changeBoardInfo', data);
    },
    changeCurrentBoardSettingsSync({ commit }, data) {
      commit('changeCurrentBoardSettings', data);
    },
    changeBoardsListSync({ commit }, data) {
      commit('changeBoardsList', data);
    },
    changeTasksListSync({ commit }, data) {
      commit('changeTasksList', data);
    },
    //---------boards-------------
    async getBoardsTasks({ commit }, dataUser) {
      await axios
        .get(`/user/${dataUser.userId}/boards`, {})
        .then((response) => {
          commit('changeBoardsList', response.data);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async createBoardTasks({ commit }, dataUser) {
      await axios
        .post(`/user/${dataUser.userId}/boards`, {
          formData: {
            name: dataUser.name,
            description: dataUser.description,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async getBoardsTasksInfo({ commit }, dataUser) {
      await axios
        .get(`user/${dataUser.userId}/boards/${dataUser.boardId}`, {})
        .then((response) => {
          commit('changeBoardInfo', response.data);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async editBoardTasks({ commit }, dataUser) {
      await axios
        .put(`user/${dataUser.userId}/boards/${dataUser.boardId}`, {
          formData: {
            name: dataUser.name,
            description: dataUser.description,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async renameBoardTasks({ commit }, dataUser) {
      await axios
        .patch(`user/${dataUser.userId}/boards/${dataUser.boardId}`, {
          formData: {
            name: dataUser.name,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async deleteBoardTasks({ commit }, dataUser) {
      await axios
        .delete(`user/${dataUser.userId}/boards/${dataUser.boardId}`, {})
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async getBoardPermissions({ commit }, dataUser) {
      await axios
        .get(`boards/${dataUser.boardId}/permissions`, {})
        .then((response) => {
          commit('changeBoardPermissions', response.data);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    //---------Columns-------------

    async getColumnsTasks({ commit }, dataUser) {
      if (!dataUser.boardId) return;
      await axios
        .get(`boards/${dataUser.boardId}/statuses`, {})
        .then((response) => {
          commit('changeColumnsList', response?.data);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response?.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async createColumnTasks({ commit }, dataUser) {
      await axios
        .post(`boards/${dataUser.boardId}/statuses`, {
          formData: {
            name: dataUser.name,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response?.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async editColumnTasks({ commit }, dataUser) {
      await axios
        .put(`boards/${dataUser.boardId}/statuses/${dataUser.columnId}`, {
          formData: {
            name: dataUser.name,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response?.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async deleteColumnTasks({ commit }, dataUser) {
      await axios
        .delete(`boards/${dataUser.boardId}/statuses/${dataUser.columnId}`, {})
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response?.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    //---------Tasks-------------
    async getTask({ commit }, dataUser) {            
      await axios
        .get(`boards/${dataUser.boardId}/tasks`, {})
        .then((response) => {
          commit('changeTasksList', response.data);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async createTask({ commit }, dataUser) {
      await axios
        .post(`boards/${dataUser.boardId}/tasks`, {
          formData: {
            statusId: dataUser.columnId,
            name: dataUser.name,
            description: dataUser.description,
            plannedCompletionAt: dataUser.date,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async changeTask({ commit }, dataUser) {
      await axios
        .put(`boards/${dataUser.boardId}/tasks/${dataUser.taskId}`, {
          formData: {
            statusId: dataUser.columnId,
            name: dataUser.name,
            description: dataUser.description,
            plannedCompletionAt: dataUser.date,
          },
        })
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async changeTaskColumnId({ commit }, dataUser) {
      await axios
        .patch(`boards/${dataUser.boardId}/tasks/${dataUser.taskId}`, {
          formData: {
            statusId: dataUser.columnId,
          },
        })
        .then((response) => {
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },

    async deleteTask({ commit }, dataUser) {
      await axios
        .delete(`boards/${dataUser.boardId}/tasks/${dataUser.taskId}`, {})
        .then((response) => {
          commit('changeResponseTrue', response.status);
          commit('changeResponseError', '');
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          commit('changeResponseError', errorText);
        });
    },
  },
};

export default tasksListModule;
