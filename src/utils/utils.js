export const monthList = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export const userInfo = [
  {
    name: 'Darth Vader',
    password: 'admin',
    img: 'vader.jpg',
    email: 'DarthVader@mail.com',
  },
];

export function getDeadlineRelevanceClass(cardDate) {
  const currentDate = new Date();
  const deadline = new Date(cardDate.split('T')[0]);
  const timeDiff = deadline.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff <= 7) {
    return 'overdue-deadlines';
  }
  if (daysDiff <= 14) {
    return 'burning-deadlines';
  }
  return 'acceptable-deadlines';
}

export function getCurrentDate() {
  const currentDateNew = new Date();
  const dd = currentDateNew.getDate();
  const mm = currentDateNew.getMonth() + 1;
  const yy = currentDateNew.getFullYear();
  return `${dd}.${mm}.${yy}`;
}

export function formattingDate(date) {
  let dateNumberArr;

  if (date.length < 10) {
    dateNumberArr = date.split('.');
  }
  if (date.length >= 10) {
    dateNumberArr = date.split('T')[0].split('-').reverse();
  }

  for (let key in monthList) {
    if (Number(key) === Number(dateNumberArr[1])) {
      dateNumberArr.splice(1, 1, monthList[key]);
    }
  }
  return dateNumberArr.join(' ');
}

export function displayNumberTasks() {
  const columnsTasksBody = document.querySelectorAll('.list-column__body');
  columnsTasksBody.forEach((el) => {
    const titleColumns = el.parentNode.querySelector('span');
    const deleteBtnTasksColumn = el.querySelector('.list-column__btn-delete-task-list');
    const quantityCards = el.querySelectorAll('.card-task').length;
    titleColumns.innerText = quantityCards;

    if (quantityCards === 0) {
      deleteBtnTasksColumn.classList.add('list-column__btn-delete-task-list_visible');
    } else {
      deleteBtnTasksColumn.classList.remove('list-column__btn-delete-task-list_visible');
    }
  });
}

export function calculateTaskProgress() {
  const cardsArr = document.querySelectorAll('.card-task');
  cardsArr.forEach((card) => {
    const sliderProgress = card.querySelector('.card-task__progress-slider');
    const lineProgressWidth = card.querySelector('.card-task__progress-line').offsetWidth;
    const tasksCompleted = card.querySelector('.first-value').textContent;
    const totalTasks = card.querySelector('.second-value').textContent;
    const completionPercentage = (tasksCompleted * 100) / totalTasks;
    const widthSliderProgressMath = (completionPercentage * lineProgressWidth) / 100;
    sliderProgress.style.width = widthSliderProgressMath + 'px';
  });
}

export const permissionListBoard = {
  'delete-board': 'Удаление доски',
  'delete-board-statuses': 'Удаление колонок',
  'manage-board': 'Управлять доской',
  'manage-board-statuses': 'Управлять колонками',
  'manage-board-users': 'Управлять пользователями',
};

export const permissionListUser = {
  'delete-board': 'Удаление доски',
  'delete-board-statuses': 'Удаление колонок',
  'manage-board': 'Управлять доской',
  'manage-board-statuses': 'Управлять колонками',
  'manage-board-users': 'Управлять пользователями',
};