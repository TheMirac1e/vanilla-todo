class ToDoList {
    constructor(taskText, listElement) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
        this.listElement = listElement;
        this.taskText = taskText;
        this.isComplete = false;
        this.init();
    }

    init() {
        this.createTaskElement();
    }

    createTaskElement() {
        const ulElement = document.createElement('ul');
        ulElement.classList.add('todo-list__list');

        this.tasks.forEach((text, index) => {
            const liElement = document.createElement('li');

            liElement.classList.add('todo-list__item');
            liElement.setAttribute('id', `task-number-${index}`);
            liElement.innerHTML = `
                <label for="checked-${index}">
                    <input id="checked-${index}" type="checkbox">
                        ${text.task}
                    </label>
            `

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('todo-list__delete');
            deleteButton.setAttribute('type', 'button');
            deleteButton.innerText = 'delete'
            deleteButton.addEventListener('click', () => {
                ulElement.removeChild(liElement);
                this.tasks = this.tasks.slice(0, index).concat(this.tasks.slice(index + 1, this.tasks.length));
                this.saveTaskInLocalStorage();
            })

            liElement.appendChild(deleteButton);
            ulElement.appendChild(liElement);
        })

        this.listElement.appendChild(ulElement);
    }

    addTask(text) {
        if (text === '' || text === null) {
            console.log('sorry, add some to input');
        } else {
            this.tasks.push({
                'task': this.taskText,
                'isComplete': this.isComplete,
            });
            this.saveTaskInLocalStorage();
        }
    }

    saveTaskInLocalStorage() {
        window.localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
}


const todoInput = document.querySelector('#todoInput');
const addForm = document.querySelector('.todo-list__form');
const todoListElement = document.querySelector('.todo-list');

const todoList = new ToDoList(todoInput.value, todoListElement);

addForm.addEventListener('change', (e) => {
    e.preventDefault();

    if (todoInput.value !== '') {
        todoList.taskText = todoInput.value;
        todoList.addTask(todoInput.value);
    }
    todoInput.value = '';
})
