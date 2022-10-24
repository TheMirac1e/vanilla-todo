class ToDoList {
    constructor(listElement) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
        this.listElement = listElement;
        this.taskText = '';
        this.isChecked = false;
        this.isFavorite = false;
        this.taskId = Math.floor(Math.random() * Date.now());
        this.init();
    }

    init() {
        this.createTaskElement();
        this.addEvents();
    }

    addEvents() {
        this.formSubmitHandler();
        this.filterSelectHandler();
    }

    createTaskElement() {
        const ulElement = document.createElement('ul');
        ulElement.classList.add('todo-list__list');
        ulElement.setAttribute('role', 'list');

        this.tasks.forEach((item, index) => {
            const liElement = document.createElement('li');

            liElement.classList.add('todo-list__item');
            liElement.setAttribute('id', `${item.id}`);
            liElement.setAttribute('role', 'listitem');
            liElement.innerHTML = `
                <input class="todo-list__checkbox" id="checked-${index}" type="checkbox">
                <label class="todo-list__label" for="checked-${index}">
                   ${item.task}
                </label>
                <span class="todo-list__like" aria-hidden="true" title="heart">
                    <i class="far fa-heart"></i>
                </span>
                <button class="todo-list__delete" type="button">
                <i class="fas fa-times"></i>
                    delete
                </button>      
            `
            const deleteElement = liElement.querySelector('.todo-list__delete');
            const checkboxElement = liElement.querySelector('.todo-list__checkbox');
            const likeElement = liElement.querySelector('.todo-list__like');

            if (item.isComplete) {
                liElement.classList.add('is-checked');
                checkboxElement.checked = true;
                deleteElement.setAttribute('disabled', 'disabled');
            }

            checkboxElement.addEventListener('click', () => {
                if (checkboxElement.checked) {
                    item.isComplete = true;
                    this.saveTaskInLocalStorage();
                    liElement.classList.add('is-checked');
                    deleteElement.setAttribute('disabled', 'disabled');
                } else {
                    item.isComplete = false;
                    this.saveTaskInLocalStorage();
                    liElement.classList.remove('is-checked');
                    deleteElement.removeAttribute('disabled');
                }
            });

            if (item.isFavorite) {
                liElement.classList.add('like');
            }

            likeElement.addEventListener('click', () => {
                liElement.classList.toggle('like');
                item.isFavorite = liElement.classList.contains('like');
                this.saveTaskInLocalStorage();
            });

            deleteElement.addEventListener('click', () => {
                this.tasks = this.tasks.filter(item => {
                    return liElement.id.toString() !== item.id.toString();
                });
                this.saveTaskInLocalStorage();
                ulElement.removeChild(liElement);
            })

            ulElement.appendChild(liElement);
        })

        this.listElement.appendChild(ulElement);
    }

    addTask() {
        this.tasks.push({
            'task': this.taskText,
            'isComplete': this.isChecked,
            'id': this.taskId,
            'isFavorite': this.isFavorite
        });
        this.saveTaskInLocalStorage();
    }

    filterTasks(event) {
        const tasks = document.querySelectorAll('.todo-list__item');

        tasks.forEach(task => {
            switch (event.target.value) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'favorites':
                    if (task.classList.contains('like')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;
                case 'uncompleted':
                    if (task.classList.contains('is-checked')) {
                        task.style.display = 'none';
                    } else {
                        task.style.display = 'flex';
                    }
                    break;
                case 'completed':
                    if (!task.classList.contains('is-checked')) {
                        task.style.display = 'none';
                    } else {
                        task.style.display = 'flex';
                    }
                    break;
            }
        })
    }

    filterSelectHandler() {
        const todoFilter = document.querySelector('.todo-list__filter');

        todoFilter.addEventListener('change', (e) => {
            this.filterTasks(e);
        })
    }

    formSubmitHandler() {
        const addForm = document.querySelector('.todo-list__form');
        const todoInput = document.getElementById('todoInput');

        addForm.addEventListener('submit', () => {
            if (todoInput.value !== '') {
                this.taskText = todoInput.value;
                this.addTask();
            } else {
                alert('Sorry, you must add something to input. Thanks!');
            }
            todoInput.value = '';
        })
    }


    saveTaskInLocalStorage() {
        window.localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
}

new ToDoList(document.querySelector('.todo-list'));

