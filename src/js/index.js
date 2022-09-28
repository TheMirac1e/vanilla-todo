class ToDoList {
    constructor(listElement) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
        this.listElement = listElement;
        this.taskText = '';
        this.isChecked = false;
        this.taskId = Math.floor(Math.random() * Date.now())
        this.init();
    }

    init() {
        this.createTaskElement();
    }

    createTaskElement() {
        const ulElement = document.createElement('ul');
        ulElement.classList.add('todo-list__list');

        this.tasks.forEach((item, index) => {
            const liElement = document.createElement('li');
            const deleteButton = document.createElement('button');
            const checkboxElement = document.createElement('input');

            liElement.classList.add('todo-list__item');
            liElement.setAttribute('id', `${item.id}`);
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
            } else {
                liElement.classList.remove('is-checked');
                checkboxElement.checked = false;
                deleteButton.removeAttribute('disabled');
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

    saveTaskInLocalStorage() {
        window.localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
}


const todoInput = document.querySelector('#todoInput');
const addForm = document.querySelector('.todo-list__form');
const todoListElement = document.querySelector('.todo-list');

const todoList = new ToDoList(todoListElement);

addForm.addEventListener('change', (e) => {
    e.preventDefault();

    if (todoInput.value !== '') {
        todoList.taskText = todoInput.value;
        todoList.addTask(todoInput.value);
    } else {
        console.log('Sorry, you must add something to input. Thanks!');
    }
    todoInput.value = '';
})
