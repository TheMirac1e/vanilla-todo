class ToDoList {
    constructor(listElement) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
        this.listElement = listElement;
        this.taskText = '';
        this.isChecked = false;
        this.taskId = Math.floor(Math.random() * Date.now());
        this.init();
    }

    init() {
        this.createTaskElement();
        this.formSubmitHandler();
        this.filterInputHandler();
    }

    createTaskElement() {
        const ulElement = document.createElement('ul');
        ulElement.classList.add('todo-list__list');
        ulElement.setAttribute('role', 'list');

        this.tasks.forEach((item, index) => {
            const liElement = document.createElement('li');
            const deleteButton = document.createElement('button');
            const checkboxElement = document.createElement('input');

            liElement.classList.add('todo-list__item');
            liElement.setAttribute('id', `${item.id}`);
            liElement.setAttribute('role', 'listitem');
            liElement.innerHTML = `
               <label for="checked-${index}">
                   ${item.task}
               </label>
            `

            checkboxElement.setAttribute('id', `checked-${index}`);
            checkboxElement.setAttribute('type', 'checkbox');

            if (item.isComplete) {
                liElement.classList.add('is-checked');
                checkboxElement.checked = true;
                deleteButton.setAttribute('disabled', 'disabled');
            }

            checkboxElement.addEventListener('click', () => {
                if (checkboxElement.checked) {
                    item.isComplete = true;
                    this.saveTaskInLocalStorage();
                    liElement.classList.add('is-checked');
                    deleteButton.setAttribute('disabled', 'disabled');
                } else {
                    item.isComplete = false;
                    this.saveTaskInLocalStorage();
                    liElement.classList.remove('is-checked');
                    deleteButton.removeAttribute('disabled');
                }
            })

            deleteButton.classList.add('todo-list__delete');
            deleteButton.setAttribute('type', 'button');
            deleteButton.innerText = 'delete'
            deleteButton.addEventListener('click', () => {
                this.tasks = this.tasks.filter(item => {
                    return liElement.id.toString() !== item.id.toString();
                });
                this.saveTaskInLocalStorage();
                ulElement.removeChild(liElement);
            })

            ulElement.appendChild(liElement);
            liElement.appendChild(deleteButton);
            liElement.insertAdjacentElement('afterbegin', checkboxElement);
        })

        this.listElement.appendChild(ulElement);
    }

    addTask(text) {
        if (text === '' || text === null) {
            console.log('sorry, add some to input');
        } else {
            this.tasks.push({
                'task': this.taskText,
                'isComplete': this.isChecked,
                'id': this.taskId,
            });
            this.saveTaskInLocalStorage();
        }
    }

    filterInputHandler() {
        const todoFilter = document.querySelector('.todo-list__filter');

        todoFilter.addEventListener('change', (e) => {
            this.filterByName(e);
        })

    }

    filterByName(event) {
        const tasks = document.querySelectorAll('.todo-list__item');

        tasks.forEach(task => {
            switch (event.target.value) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'uncompleted':
                    if(task.classList.contains('is-checked')) {
                        task.style.display = 'none';
                    } else {
                        task.style.display = 'flex';
                    }
                    break;
                case 'completed':
                    if(!task.classList.contains('is-checked')) {
                        task.style.display = 'none';
                    } else {
                        task.style.display = 'flex';
                    }
                    break;
            }
        })
    }

    formSubmitHandler() {
        const addForm = document.querySelector('.todo-list__form');
        const todoInput = document.getElementById('todoInput');

        addForm.addEventListener('submit', () => {
            if (todoInput.value !== '') {
                this.taskText = todoInput.value;
                this.addTask(todoInput.value);
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

