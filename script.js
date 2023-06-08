document.addEventListener('DOMContentLoaded', function () {


  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const monthYear = document.getElementById("monthYear");
  const calendarBody = document.getElementById("calendarBody")
  const calendarPanel = document.querySelector('.calendar')
  const createTaskForm = document.querySelector('.tasks__add-new')
  const datePanelBtn = document.querySelector('.date__panel-btn')
  const datePanelToday = document.querySelector('.date-today')
  const datePanelPrev = document.querySelector('.date__panel-prev')
  const datePanelNext = document.querySelector('.date__panel-next')
  const choiseTaskPlaces = [...document.querySelectorAll('.task__list-controls-item')]
  const taskLists = document.querySelectorAll('.task')
  const formBtnCreate = document.getElementById('tasks__add')
  const formBtnSave = document.querySelector('.tasks__save')
  const formBtnClose = document.querySelector('.tasks__close')
  let formHeader = document.getElementById('form-header')
  let formDescr = document.getElementById('form-descr')
  let formPlace = document.getElementById('form-place')
  let formDate = document.getElementById('form-date')
  const newTask = document.querySelector('.task__new')
  const processTask = document.querySelector('.task__process')
  const completedTask = document.querySelector('.task__completed')
  const taskDoneBtn = document.querySelector('.task__done')
  const taskFullList = document.querySelector('.task-descr')
  let fullListContainer = document.querySelector('.full-list-container')
  let todayFullList = document.querySelector('.full-list-date-today')
  const taskListField = document.querySelector('.task__list-items')
  const addItemTaskList = document.querySelector('.task__list-btn-add')
  const confirmBtn = document.querySelector('.task__list-confirm')
  const taskListInput = document.querySelector('.task__list-input')
  const inputField = document.querySelector('.task__list-new-item')
  let container = document.getElementById('container')
  const formDateInput = document.getElementById('form-date');
  const errorMessage = document.querySelector('.tasks__add-error-message');
  let taskData = JSON.parse(localStorage.getItem('taskData')) || [];
  let removeCompletedTaskBtn;
  let taskId;
  let taskDescription = ''



  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];


  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();




  prevBtn.addEventListener("click", showPreviousMonth);
  nextBtn.addEventListener("click", showNextMonth);
  formBtnCreate.addEventListener('click', createNewTask)
  formBtnSave.addEventListener('click', saveNewTask)
  formBtnClose.addEventListener('click', closeNewTask)
  datePanelBtn.addEventListener('click', showToday)
  datePanelToday.addEventListener('click', openCloseCalendar)
  addItemTaskList.addEventListener('click', addItem)




  datePanelPrev.addEventListener('click', prevDate)
  datePanelNext.addEventListener('click', nextDate)

  choiseTaskPlaces.forEach((choisePlace, index) => {
    choisePlace.addEventListener('click', (event) => {
      event.preventDefault();

    });
  });


  formBtnSave.addEventListener('click', function () {
    if (formDateInput.value === '') {
      errorMessage.style.visibility = 'visible';
    } else {
      errorMessage.style.visibility = 'hidden';
    }
  });

  function showCalendar() {
    monthYear.textContent = monthNames[currentMonth] + " " + currentYear;
    datePanelToday.textContent = `${currentDay}  ${monthNames[currentMonth]} ${currentYear}`;

    calendarBody.innerHTML = "";
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingPos = firstDay.getDay();

    for (let i = 0; i < startingPos; i++) {
      const cell = document.createElement("div");
      calendarBody.appendChild(cell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const cell = document.createElement("div");
      cell.textContent = i;
      cell.classList.add("calendar-grid-cell");
      cell.addEventListener("click", function () {
        currentDate.setDate(i);
        updateDatePanelToday();
        openCloseCalendar();
      });

      calendarBody.appendChild(cell);
      if (i === currentDay && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        cell.classList.add("current-day");
      }
    }
    getCalendarNumbers();
    updateDatePanelToday();
  }


  function openCloseCalendar() {
    calendarPanel.classList.toggle('display-none');
  }

  function showToday() {
    currentDate.setMonth(currentMonth);
    currentDate.setFullYear(currentYear);
    currentDate.setDate(currentDay);
    showCalendar();
    updateDatePanelToday();
  }

  function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    showCalendar();
    monthYear.textContent = monthNames[currentMonth] + " " + currentYear;
  }

  function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    showCalendar();
    monthYear.textContent = monthNames[currentMonth] + " " + currentYear;
  }

  function prevDate() {
    currentDate.setDate(currentDate.getDate() - 1);
    showCalendar();
    updateDatePanelToday();
  }

  function nextDate() {
    currentDate.setDate(currentDate.getDate() + 1);
    showCalendar();
    updateDatePanelToday();
  }

  function updateDatePanelToday() {
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    datePanelToday.textContent = `${day} ${monthNames[month]} ${year}`;
    todayFullList.textContent = `${day} ${monthNames[month]} ${year}`;
    updateTaskDate();
  }

  showCalendar();

  function updateTaskDate() {
    let dateString = todayFullList.textContent;
    let parts = dateString.split(' ');
    let day = parseInt(parts[0]);
    let monthName = parts[1];
    let year = parts[2];
    let monthIndex = monthNames.indexOf(monthName);
    let taskDates = new Date(Date.UTC(year, monthIndex, day));
    let todayFullListFormattedDate = taskDates.toISOString().slice(0, 10);
    let childNodes = container.childNodes;

    let taskDate = new Date(formDate.value);
    let childElements = Array.from(childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);

    for (let i = 0; i < childElements.length; i++) {
      let childElement = childElements[i];
      let childDate = childElement.getAttribute('data-date');


      if (childDate === todayFullListFormattedDate) {
        childElement.classList.remove('display-none');
      } else {
        childElement.classList.add('display-none');
      }
    }
  }


  function getCalendarNumbers() {
    const calendarBody = document.getElementById('calendarBody');
    const calendarNumbers = Array.from(calendarBody.getElementsByClassName('calendar-grid-cell'));
    const taskDates = getTaskDates(); // Получаем массив дат задач



    calendarNumbers.forEach(cell => {
      const number = parseInt(cell.textContent);
      const day = number.toString().padStart(2, '0');
      const taskDatesFormatted = taskDates.map(date => date.slice(0, 10));
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day}`;
      const cellDate = new Date(formattedDate);

      if (taskDatesFormatted.includes(formattedDate)) {
        if (cellDate < currentDate) {
          cell.classList.add('task__title-done');
        } else {
          cell.classList.add('task__new-item-background-process');
        }
      }
    });


  }

  getCalendarNumbers();

  function getTaskDates() {
    let taskData = JSON.parse(localStorage.getItem('taskData')) || [];
    let taskDates = taskData.map(task => task.formDate);
    return taskDates;
  }



  function addItem() {
    inputField.classList.remove('display-none');

    confirmBtn.addEventListener('click', () => {
      const newElement = createTaskElement(taskListInput.value);
      taskListField.append(newElement);

      inputField.classList.add('display-none');
      taskListInput.value = '';
    });

    inputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const newElement = createTaskElement(taskListInput.value);
        taskListField.append(newElement);

        inputField.classList.add('display-none');
        taskListInput.value = '';
      }
    });
  }

  function createTaskElement(value) {
    const newElement = document.createElement('a');
    newElement.classList.add('task__list-controls-item');

    const taskText = document.createElement('span');
    taskText.textContent = value;

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '&#10006;';
    deleteIcon.style.display = 'none';

    newElement.appendChild(taskText);
    newElement.appendChild(deleteIcon);

    newElement.addEventListener('mouseover', function () {
      const rect = taskText.getBoundingClientRect();
      const leftOffset = rect.right + 5;
      const topOffset = rect.top - 15;
      deleteIcon.style.left = `${leftOffset}px`;
      deleteIcon.style.top = `${topOffset}px`;


      deleteIcon.style.display = 'block';
    });


    deleteIcon.addEventListener('mouseout', function () {
      deleteIcon.style.display = 'none';
    });


    deleteIcon.addEventListener('click', function (event) {
      const taskItem = event.target.parentNode;
      taskItem.parentNode.removeChild(taskItem);
    });

    return newElement;
  }


  function createNewTask() {
    createTaskForm.classList.remove('display-none')
  }

  function closeNewTask(event) {
    event.preventDefault()
    createTaskForm.classList.add('display-none')
    formHeader.value = ''
    formDescr.value = ''
    formPlace.value = ''
    formDate.value = ''
  }


  function saveNewTask(event) {

    event.preventDefault();

    formHeader.textContent = formHeader.value;
    formDescr.textContent = formDescr.value;
    formPlace.textContent = formPlace.value;
    formDate.textContent = formDate.value;

    taskDescription = formDescr.value;

    let uniqueId = Date.now();

    let newElement = document.createElement('div');
    newElement.setAttribute('data-task-id', uniqueId);
    newElement.innerHTML = `
      <div class="task__new-item task__new-item-background">
        <div class="task__title">
          ${formHeader.value}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
              x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g id="location">
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${formPlace.value}
        </div>
        <div class="task__time">
          ${formDate.value}
        </div>
        <div class="task__full-list-decription display-none">
        ${formDescr.value}
        </div>
        <div class="task__btns">
          <a href="#" class="task__done"><i class="fa-solid fa-circle-check"></i></a>
          <a href="#" class="task__in-progress"> <i class="fa-regular fa-circle-right"></i></a>
          <a href="#" class="task__remove" data-task-id="${uniqueId}"><i class="fa-solid fa-trash-can"></i></a>
        </div>
      </div>`;



    let newElementForFullList = document.createElement('div');
    newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__new-item-background">
        <div class="task__title">
          ${formHeader.value}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${formPlace.value}
        </div>
        <div class="task__time">
        ${formDate.value}
        </div>
        <div class="task__full-list-decription">
        ${formDescr.value}
        </div>
      </div>
    </div>`;


    newElementForFullList.dataset.fullListItem = uniqueId;

    let taskDate = new Date(formDate.value);
    let formattedDate = taskDate.toISOString().slice(0, 10);

    newElementForFullList.setAttribute('data-date', formattedDate);


    let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
    if (!taskContainer) {
      taskContainer = document.createElement('div');
      taskContainer.dataset.date = formattedDate;

      container.appendChild(taskContainer);
    }

    taskContainer.appendChild(newElementForFullList);
    newTask.appendChild(newElement);


    let taskData = JSON.parse(localStorage.getItem('taskData')) || [];
    let existingTaskIndex = taskData.findIndex((task) => task.taskId === uniqueId);

    if (existingTaskIndex === -1) {
      taskData.push({
        taskId: uniqueId,
        formHeader: formHeader.value,
        formPlace: formPlace.value,
        formDate: formDate.value,
        formDescr: formDescr.value,
        status: 'newTask'
      });
    } else {
      taskData[existingTaskIndex].formHeader = formHeader.value;
      taskData[existingTaskIndex].formPlace = formPlace.value;
      taskData[existingTaskIndex].formDate = formDate.value;
      taskData[existingTaskIndex].formDescr = formDescr.value;
    }



    localStorage.setItem('taskData', JSON.stringify(taskData));

    let doneButton = newElement.querySelector('.task__done');
    doneButton.addEventListener('click', doneTask);
    doneButton.addEventListener('click', () => {
      let taskId = uniqueId;
      let taskData = JSON.parse(localStorage.getItem('taskData')) || [];

      let indexToRemoveNewTask = taskData.findIndex((task) => task.taskId === taskId && task.status === 'newTask');
      if (indexToRemoveNewTask !== -1) {
        taskData.splice(indexToRemoveNewTask, 1);
      }

      let indexToRemoveInProgress = taskData.findIndex((task) => task.taskId === taskId && task.status === 'inProcess');
      if (indexToRemoveInProgress !== -1) {
        taskData.splice(indexToRemoveInProgress, 1);
      }

      localStorage.setItem('taskData', JSON.stringify(taskData));

      newElementForFullList.remove();
    });


    let processTask = newElement.querySelector('.task__in-progress');
    processTask.addEventListener('click', inProcess);
    processTask.addEventListener('click', () => {
      newElementForFullList.remove();
    });

    processTask.addEventListener('click', () => {
      let taskId = uniqueId;
      let taskData = JSON.parse(localStorage.getItem('taskData')) || [];

      // Удаляем задачу из раздела "новые задачи"
      let indexToRemoveNewTask = taskData.findIndex((task) => task.taskId === taskId && task.status === 'newTask');
      if (indexToRemoveNewTask !== -1) {
        taskData.splice(indexToRemoveNewTask, 1);
      }

      // Удаляем задачу из раздела "в процессе"
      let indexToRemoveInProgress = taskData.findIndex((task) => task.taskId === taskId && task.status === 'inProcess');
      if (indexToRemoveInProgress !== -1) {
        taskData.splice(indexToRemoveInProgress, 1);
      }

      localStorage.setItem('taskData', JSON.stringify(taskData));
    });


    let taskId = uniqueId;
    removeCompletedTaskBtn = newElement.querySelector('.task__remove');
    removeCompletedTaskBtn.addEventListener('click', removeTask);
    removeCompletedTaskBtn.addEventListener('click', () => {
      newElementForFullList.remove();
      removeTaskLocalstorage(taskId);
    });


    updateTaskDate()
    closeNewTask(event);
    showCalendar()

  };



  function removeTaskLocalstorage(taskId) {
    let taskData = JSON.parse(localStorage.getItem('taskData')) || [];
    let indexToRemove = taskData.findIndex((task) => task.taskId === taskId);

    if (indexToRemove !== -1) {
      taskData.splice(indexToRemove, 1);
      localStorage.setItem('taskData', JSON.stringify(taskData));
    }
    showCalendar()
  }



  function removeTask(event) {
    let target = event.target;
    let taskItem = target.closest('.task__new-item');
    taskItem.remove();


    taskId = target.dataset.taskId;
    let fullListItem = document.querySelector(`[data-full-list-item="${taskId}"]`);
    if (fullListItem) {
      fullListItem.remove();
    }
    showCalendar()
  }


  function saveLocalstorage() {
    let taskData = JSON.parse(localStorage.getItem('taskData'));
    if (taskData) {
      for (let task of taskData) {
        let uniqueId = task.taskId;


        if (task.status === 'newTask') {
          let newTask = document.querySelector('.task__new');
          let newElement = document.createElement('div');
          newElement.setAttribute('data-task-id', uniqueId);
          newElement.innerHTML = `
        <div class="task__new-item task__new-item-background">
          <div class="task__title">
            ${task.formHeader}
          </div>
          <div class="task__place">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
                x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
                enable-background="new 0 0 32 32" xml:space="preserve">
                <g id="location">
                  <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                    d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                    d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
                </g>
             </svg>
            </span>
            ${task.formPlace}
          </div>
          <div class="task__time">
            ${task.formDate}
          </div>
          <div class="task__full-list-decription display-none">
          ${task.formDescr}
          </div>
          <div class="task__btns">
            <a href="#" class="task__done">  <i class="fa-solid fa-circle-check"></i></a>
            <a href="#" class="task__in-progress">
            <i class="fa-regular fa-circle-right"></i></a>
            <a href="#" class="task__remove" data-task-id="${uniqueId}"> <i class="fa-solid fa-trash-can"></i></a>
          </div>
        </div>`;



          let newElementForFullList = document.createElement('div');
          newElementForFullList.setAttribute('data-task-id', uniqueId);
          newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__new-item-background">
        <div class="task__title">
          ${task.formHeader}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${task.formPlace}
        </div>
        <div class="task__time">
        ${task.formDate}
        </div>
        <div class="task__full-list-decription">
        ${task.formDescr}
        </div>
    </div>`;


          newElementForFullList.dataset.fullListItem = uniqueId;

          let taskDate = new Date(task.formDate);
          let formattedDate = taskDate.toISOString().slice(0, 10);

          newElementForFullList.setAttribute('data-date', formattedDate);


          let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
          if (!taskContainer) {
            taskContainer = document.createElement('div');
            taskContainer.dataset.date = formattedDate;
            container.appendChild(taskContainer);
          }

          taskContainer.appendChild(newElementForFullList);
          newTask.appendChild(newElement)



          let processTask = newElement.querySelector('.task__in-progress');
          processTask.addEventListener('click', inProcess);
          processTask.addEventListener('click', () => {
            newElementForFullList.remove();
          });

          processTask.addEventListener('click', () => {
            let taskId = uniqueId;
            let taskData = JSON.parse(localStorage.getItem('taskData')) || [];

            // Удаляем задачу из раздела "новые задачи"
            let indexToRemoveNewTask = taskData.findIndex((task) => task.taskId === taskId && task.status === 'newTask');
            if (indexToRemoveNewTask !== -1) {
              taskData.splice(indexToRemoveNewTask, 1);
            }

            // Удаляем задачу из раздела "в процессе"
            let indexToRemoveInProgress = taskData.findIndex((task) => task.taskId === taskId && task.status === 'inProcess');
            if (indexToRemoveInProgress !== -1) {
              taskData.splice(indexToRemoveInProgress, 1);
            }

            localStorage.setItem('taskData', JSON.stringify(taskData));
          });



          let doneButton = newElement.querySelector('.task__done');

          doneButton.addEventListener('click', doneTask);
          doneButton.addEventListener('click', () => {
            newElementForFullList.remove();

          });

          doneButton.addEventListener('click', () => {
            let taskId = uniqueId;
            let taskData = JSON.parse(localStorage.getItem('taskData')) || [];

            // Удаляем задачу из раздела "новые задачи"
            let indexToRemoveNewTask = taskData.findIndex((task) => task.taskId === taskId && task.status === 'newTask');
            if (indexToRemoveNewTask !== -1) {
              taskData.splice(indexToRemoveNewTask, 1);
            }

            localStorage.setItem('taskData', JSON.stringify(taskData));

          });


          let taskId = uniqueId;
          removeCompletedTaskBtn = newElement.querySelector('.task__remove');
          removeCompletedTaskBtn.addEventListener('click', removeTask);
          removeCompletedTaskBtn.addEventListener('click', () => {
            newElementForFullList.remove();
            removeTaskLocalstorage(taskId);
          });


        } else if (task.status === 'inProcess') {
          let inProcessElement = document.createElement('div');
          let processTaskContainer = document.querySelector('.task__process');
          inProcessElement.setAttribute('data-task-id', uniqueId);
          inProcessElement.innerHTML = `
          <div class="task__new-item task__new-item-background-process">
            <div class="task__title">
              ${task.formHeader}
            </div>
            <div class="task__place">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
                  x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
                  enable-background="new 0 0 32 32" xml:space="preserve">
                  <g id="location">
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                      d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                      d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
                  </g>
               </svg>
              </span>
              ${task.formPlace}
            </div>
            <div class="task__time">
              ${task.formDate}
            </div>
            <div class="task__full-list-decription display-none">
            ${task.formDescr}
            </div>
            <div class="task__btns">
              <a href="#" class="task__done"><i class="fa-solid fa-circle-check"></i></a>
          
              <a href="#" class="task__remove" data-task-id="${uniqueId}">   <i class="fa-solid fa-trash-can"></i></a>
            </div>
          </div>`;




          let newElementForFullList = document.createElement('div');
          newElementForFullList.setAttribute('data-task-id', uniqueId);
          newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__new-item-background-process">
        <div class="task__title">
          ${task.formHeader}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${task.formPlace}
        </div>
        <div class="task__time">
        ${task.formDate}
        </div>
        <div class="task__full-list-decription">
        ${task.formDescr}
        </div>
    </div>`;

          newElementForFullList.dataset.fullListItem = uniqueId;

          let taskDate = new Date(task.formDate);
          let formattedDate = taskDate.toISOString().slice(0, 10);
          newElementForFullList.setAttribute('data-date', formattedDate);


          let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
          if (!taskContainer) {
            taskContainer = document.createElement('div');
            taskContainer.dataset.date = formattedDate;
            container.appendChild(taskContainer);
          }
          taskContainer.appendChild(newElementForFullList);

          processTaskContainer.appendChild(inProcessElement);
          let removeCompletedTaskBtn = inProcessElement.querySelector('.task__remove');
          removeCompletedTaskBtn.addEventListener('click', removeTask);


          let doneButton = inProcessElement.querySelector('.task__done');
          doneButton.addEventListener('click', () => {
            taskContainer.removeChild(newElementForFullList);
          });


          doneButton.addEventListener('click', () => {
            let taskId = uniqueId
            let indexToRemoveInProgress = taskData.findIndex((task) => task.taskId === taskId && task.status === 'inProcess');
            if (indexToRemoveInProgress !== -1) {
              taskData.splice(indexToRemoveInProgress, 1);
            }
            removeTaskLocalstorage(taskId);

          });

          doneButton.addEventListener('click', doneTask);


          let taskId = uniqueId;
          removeCompletedTaskBtn = inProcessElement.querySelector('.task__remove');
          removeCompletedTaskBtn.addEventListener('click', removeTask);
          removeCompletedTaskBtn.addEventListener('click', () => {
            newElementForFullList.remove();
            removeTaskLocalstorage(taskId);
          });

        } else if (task.status === 'done') {
          let doneElement = document.createElement('div');
          let doneTaskContainer = document.querySelector('.task__completed');

          doneElement.setAttribute('data-task-id', uniqueId);
          doneElement.innerHTML = `
          <div class="task__new-item task__title-done">
            <div class="task__title task__title-done-text">
              ${task.formHeader}
            </div>
            <div class="task__place">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
                  x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
                  enable-background="new 0 0 32 32" xml:space="preserve">
                  <g id="location">
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                      d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                      d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
                  </g>
               </svg>
              </span>
              ${task.formPlace}
            </div>
            <div class="task__time">
              ${task.formDate}
            </div>
            <div class="task__full-list-decription display-none">
            ${task.formDescr}
            </div>
            <div class="task__btns" style="justify-content: right;">
              <a href="#" class="task__remove" data-task-id="${uniqueId}">     <i class="fa-solid fa-trash-can"></i></a>
            </div>
          </div>`;

          let newElementForFullList = document.createElement('div');
          newElementForFullList.setAttribute('data-task-id', uniqueId);
          newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__title-done">
        <div class="task__title  task__title-done-text">
          ${task.formHeader}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${task.formPlace}
        </div>
        <div class="task__time">
        ${task.formDate}
        </div>
        <div class="task__full-list-decription">
        ${task.formDescr}
        </div>
    </div>`;


          newElementForFullList.dataset.fullListItem = uniqueId;

          doneTaskContainer.appendChild(doneElement);

          let taskDate = new Date(task.formDate);
          let formattedDate = taskDate.toISOString().slice(0, 10);

          newElementForFullList.setAttribute('data-date', formattedDate);


          let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
          if (!taskContainer) {
            taskContainer = document.createElement('div');
            taskContainer.dataset.date = formattedDate;
            container.appendChild(taskContainer);
          }

          taskContainer.appendChild(newElementForFullList);

          let taskId = uniqueId;
          removeCompletedTaskBtn = doneElement.querySelector('.task__remove');
          removeCompletedTaskBtn.addEventListener('click', removeTask);
          removeCompletedTaskBtn.addEventListener('click', () => {
            newElementForFullList.remove();
            removeTaskLocalstorage(taskId);
          });
        }
      }
    }
    showCalendar()
  }

  saveLocalstorage();



  function inProcess(event) {
    let target = event.target;
    let taskItem = target.closest('.task__new-item');
    let wrapperElement = taskItem.parentNode;
    let uniqueId = Date.now();


    formHeader.value = taskItem.querySelector('.task__title').textContent
    formPlace.value = taskItem.querySelector('.task__place').textContent
    formDate.value = taskItem.querySelector('.task__time').innerText
    formDescr.value = taskItem.querySelector('.task__full-list-decription').textContent

    let newElement = document.createElement('div')
    newElement.innerHTML = `
    <div class="task__new-item task__new-item-background-process">
    <div class="task__title">
        ${formHeader.value}
    </div>
    <div class="task__place">
        <span><svg xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
                x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
                enable-background="new 0 0 32 32" xml:space="preserve">
                <g id="location">
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                        d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                        d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
                </g>
            </svg></span>
            ${formPlace.value}
    </div>
    <div class="task__time">
       ${formDate.value}
    </div>
    <div class="task__full-list-decription display-none">
    ${formDescr.value}
    </div>
    <div class="task__btns">
    <a href="#" class="task__done">  <i class="fa-solid fa-circle-check"></i></a>
    <a href="#" class="task__remove" data-task-id="${uniqueId}"> <i class="fa-solid fa-trash-can"></i></a>
    </div>
    </div>`
    processTask.appendChild(newElement)


    let newElementForFullList = document.createElement('div');

    newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__new-item-background-process">
        <div class="task__title">
          ${formHeader.value}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${formPlace.value}
        </div>
        <div class="task__time">
        ${formDate.value}
        </div>
        <div class="task__full-list-decription">
        ${formDescr.value}
        </div>
      </div>
    </div>`

    let taskDate = new Date(formDate.value);
    let formattedDate = taskDate.toISOString().slice(0, 10);

    newElementForFullList.setAttribute('data-date', formattedDate);


    let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
    newElementForFullList.dataset.fullListItem = uniqueId;

    taskContainer.appendChild(newElementForFullList);

    let taskData = JSON.parse(localStorage.getItem('taskData')) || [];
    let newTask = {
      taskId: uniqueId,
      formHeader: formHeader.value,
      formPlace: formPlace.value,
      formDate: formDate.value,
      formDescr: formDescr.value,
      status: 'inProcess'
    };

    taskData.push(newTask);

    localStorage.setItem('taskData', JSON.stringify(taskData));


    let doneButton = newElement.querySelector('.task__done');
    doneButton.addEventListener('click', () => {
      newElementForFullList.remove()
      removeTaskLocalstorage(taskId)
    });

    doneButton.addEventListener('click', doneTask);

    taskItem.remove();
    wrapperElement.remove()
    closeNewTask(event)


    let taskId = uniqueId;
    removeCompletedTaskBtn = newElement.querySelector('.task__remove');
    removeCompletedTaskBtn.addEventListener('click', removeTask);
    removeCompletedTaskBtn.addEventListener('click', () => {
      newElementForFullList.remove();
      removeTaskLocalstorage(taskId);
    });

    showCalendar()
  }



  function doneTask(event) {
    let target = event.target;
    let taskItem = target.closest('.task__new-item');
    let wrapperElement = taskItem.parentNode;
    let uniqueId = Date.now();



    formHeader.value = taskItem.querySelector('.task__title').textContent
    formPlace.value = taskItem.querySelector('.task__place').textContent
    formDescr.value = taskItem.querySelector('.task__full-list-decription').textContent
    formDate.value = taskItem.querySelector('.task__time').innerText
    



    let newElement = document.createElement('div');
    newElement.classList.add('task__new-item', 'task__title-done');
    newElement.setAttribute('data-task-id', uniqueId);
    newElement.innerHTML = `
   
      <div class="task__title ">
        ${formHeader.value}
      </div>
      <div class="task__place">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"
            x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
            enable-background="new 0 0 32 32" xml:space="preserve">
            <g id="location"></g>
              <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
              <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
            </g>
          </svg>
        </span>
        ${formPlace.value}
      </div>
      <div class="task__time">
      ${formDate.value}
   </div>
   <div class="task__full-list-decription display-none">
   ${formDescr.value}
   </div>
   <div class="task__btns" style="display:flex;justify-content: right;" >
   <a href="#" class="task__remove" data-task-id="${uniqueId}">   <i class="fa-solid fa-trash-can"></i></a>

    `;

    completedTask.appendChild(newElement)


    let newElementForFullList = document.createElement('div');
    newElementForFullList.setAttribute('data-task-id', uniqueId);
    newElementForFullList.innerHTML = `
      <div class="task__new-item full-list-container task__title-done">
        <div class="task__title  task__title-done-text">
          ${formHeader.value}
        </div>
        <div class="task__place">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1" x="0px" y="0px" width="15px" height="15px" viewbox="0 0 32 32"
              enable-background="new 0 0 32 32" xml:space="preserve">
              <g>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16.002,17.746c3.309,0,6-2.692,6-6s-2.691-6-6-6   c-3.309,0-6,2.691-6,6S12.693,17.746,16.002,17.746z M16.002,6.746c2.758,0,5,2.242,5,5s-2.242,5-5,5c-2.758,0-5-2.242-5-5   S13.244,6.746,16.002,6.746z" />
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#333333"
                  d="M16,0C9.382,0,4,5.316,4,12.001c0,7,6.001,14.161,10.376,19.194   C14.392,31.215,15.094,32,15.962,32c0.002,0,0.073,0,0.077,0c0.867,0,1.57-0.785,1.586-0.805   c4.377-5.033,10.377-12.193,10.377-19.194C28.002,5.316,22.619,0,16,0z M16.117,29.883c-0.021,0.02-0.082,0.064-0.135,0.098   c-0.01-0.027-0.084-0.086-0.129-0.133C12.188,25.631,6,18.514,6,12.001C6,6.487,10.487,2,16,2c5.516,0,10.002,4.487,10.002,10.002   C26.002,18.514,19.814,25.631,16.117,29.883z" />
              </g>
            </svg>
          </span>
          ${formPlace.value}
        </div>
        <div class="task__time">
        ${formDate.value}
        </div>
        <div class="task__full-list-decription">
        ${formDescr.value}
        </div>
    </div>`;

    let taskDate = new Date(formDate.value);
    let formattedDate = taskDate.toISOString().slice(0, 10);

    newElementForFullList.setAttribute('data-date', formattedDate);


    let taskContainer = document.querySelector('[data-date="' + formattedDate + '"]')
    newElementForFullList.dataset.fullListItem = uniqueId;

    taskContainer.appendChild(newElementForFullList);

    taskData = JSON.parse(localStorage.getItem('taskData')) || [];

    taskData.push({
      taskId: uniqueId,
      formHeader: formHeader.value,
      formPlace: formPlace.value,
      formDate: formDate.value,
      formDescr: formDescr.value,
      status: 'done'
    });

    let taskId = uniqueId
    let indexToUpdate = taskData.findIndex((task) => task.taskId === taskId);
    if (indexToUpdate !== -1) {
      taskData[indexToUpdate].status = 'done';
    }

    let indexToRemoveNewTask = taskData.findIndex((task) => task.taskId === taskId && task.status === 'newTask');
    if (indexToRemoveNewTask !== -1) {
      taskData.splice(indexToRemoveNewTask, 1);
    }



    let indexToRemoveInProgress = taskData.findIndex((task) => task.taskId === taskId && task.status === 'inProcess');
    if (indexToRemoveInProgress !== -1) {
      taskData.splice(indexToRemoveInProgress, 1);
    }

    localStorage.setItem('taskData', JSON.stringify(taskData));

    taskItem.remove()
    closeNewTask(event)
    wrapperElement.remove()

    taskId = uniqueId
    let removeCompletedTaskBtn = newElement.querySelector('.task__remove')
    removeCompletedTaskBtn.addEventListener('click', removeTask)
    removeCompletedTaskBtn.addEventListener('click', () => {
      removeTaskLocalstorage(taskId);
      newElementForFullList.remove();
    })



    showCalendar()
  }

  showCalendar();

  //удаление элементов после перезагрузки страницы
  taskData.forEach(task => {
    let taskId = task.taskId;
    let taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    let removeCompletedTaskBtn = taskElement.querySelector('.task__remove');
    removeCompletedTaskBtn.addEventListener('click', () => {
      removeTaskLocalstorage(taskId);
    });
  });


});