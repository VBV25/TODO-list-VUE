const popupModule = {
    namespaced: true,
    state: {
        popupTitle: '',
        popupType: '',

        deleteText: '',
        deleteObject: { type: '', data: {} },
        deleteStatus: false,

        nameValueInput: '',
        descriptionValueInput: '',
        dateValueInput: '',

        alertText: '',
        errorBtnPopup: '',
    },
    getters: {
        popupTitle: (state) => state.popupTitle,
        popupType: (state) => state.popupType,
        errorBtnPopup: (state) => state.errorBtnPopup,
        alertText: (state) => state.alertText,
        deleteText: (state) => state.deleteText,
        deleteObject: (state) => state.deleteObject,
        deleteStatus: (state) => state.deleteStatus,

        nameValueInput: (state) => state.nameValueInput,
        descriptionValueInput: (state) => state.descriptionValueInput,
        dateValueInput: (state) => state.dateValueInput,
    },

    mutations: {
        changePopupTitle(state, newPopupTitle) {
            state.popupTitle = newPopupTitle;
        },
        changePopupType(state, newPopupType) {
            state.popupType = newPopupType;
        },
        changeDeleteText(state, newDeleteText) {
            state.deleteText = newDeleteText;
        },
        changeError(state, newError) {
            state.errorBtnPopup = newError;
        },
        changeAlertText(state, newtextPopup) {
            state.alertText = newtextPopup;
        },
        changeDeleteObject(state, deleteObject) {
            state.deleteObject = deleteObject;
        },
        changeNameValueInput(state, nameValueInput) {
            state.nameValueInput = nameValueInput;
        },
        changeDescriptionValueInput(state, descriptionValueInput) {
            state.descriptionValueInput = descriptionValueInput;
        },
        changeDateValueInput(state, dateValueInput) {
            state.dateValueInput = dateValueInput;
        },
    },
    actions: {
        getPopupTitle({ commit }, title) {
            commit('changePopupTitle', title);
        },
        getPopupType({ commit }, type) {
            commit('changePopupType', type);
        },
        getDeleteText({ commit }, text) {
            commit('changeDeleteText', text);
        },
        getError({ commit }, error) {
            commit('changeError', error);
        },
        getAlertText({ commit }, textPopup) {
            commit('changeAlertText', textPopup);
        },
        getDeleteObject({ commit }, deleteObject) {
            commit('changeDeleteObject', deleteObject);
        },
        getNameValueInput({ commit }, nameValueInput) {
            commit('changeNameValueInput', nameValueInput);
        },
        getDescriptionValueInput({ commit }, descriptionValueInput) {
            commit('changeDescriptionValueInput', descriptionValueInput);
        },
        getDateValueInput({ commit }, dateValueInput) {
            commit('changeDateValueInput', dateValueInput);
        },
        openDropdownButtonList() {
            const parentClickBtn = event.target.closest('.change-btn').parentNode;
            const dropDownList = parentClickBtn.querySelector('.drop-btn-group');
            if (dropDownList.classList.contains('drop-btn-group_visible')) {
                dropDownList.classList.remove('drop-btn-group_visible');
            } else {
                document.querySelectorAll('.drop-btn-group').forEach(element => {
                    element.classList.remove('drop-btn-group_visible');
                });
                dropDownList.classList.add('drop-btn-group_visible');
            }
        }
    },
};

export default popupModule;
