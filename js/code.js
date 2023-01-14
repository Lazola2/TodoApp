'use strict'

// creating a reference of components from the DOM
const btnAddTodo = document.querySelector('.add-todo');
const todoInput = document.querySelector('.todo-input');
const businessOption = document.querySelector('.business');
const personalOption = document.querySelector('.personal');

// factory function to create a todo object / template
function createTodo(name, category) {
    let id = Math.floor(Math.random() * 10000);
    let finished = false;
    return { id, name, category, finished};
}

// fetching past todos
let todos = JSON.parse(localStorage.getItem('todos'))?
            JSON.parse(localStorage.getItem('todos')):
            [];

// variable to store the string value of a selected todo category
let category = '';

// set the category to business
businessOption.addEventListener('click', () => {
    category = 'business';
});

// set the category to personal
personalOption.addEventListener('click', () => {
    category = 'personal';
});

// clear the category when typing again on the input
todoInput.addEventListener('click', () => {
    category = '';
})

// clicking the the addTodo button
btnAddTodo.addEventListener('click', (e) => {
   e.preventDefault(); 
    // validate if the correct input is entered
    switch(true){
        case !todoInput.value: 
            alert('Enter a valid input');
            todoInput.focus();
            break;
        case category === '':
            alert('Enter a valid category');
            todoInput.focus();
            break;
        default:
            const fixTodoName = (todoName) => {
                let newName = '';
                let i = 0;
                todoName.split('').forEach(char => {
                    i++;
                    if (i > 20) return
                    newName += char;  
                });
                return  todoName.split('').length > 20 ? 
                        newName + '...' :
                        newName;
            }
            let todo = createTodo(fixTodoName(todoInput.value), category);
            todos.push(todo);
            storeTodos();
            
            todoInput.value = '';
            todoInput.focus();
            break;
    }
    
    renderTodos(JSON.parse(localStorage.getItem('todos')));
});

// focus the text on the edit
const focusOnEdit = ( ) => {
    category = '';
    todoInput.focus();
} 

// render all the todos on the screen
const renderTodos = (todos) => {
    let todosContainer = document.querySelector('.todos')
    if (!todos.length) {
        todosContainer.innerHTML = '';
        todosContainer.innerHTML += 
        `<div class="null-todos">
            <h1 onclick="focusOnEdit()">+</h1>
            <h2>No todos</h2>
        </div>`
    }   
    else {
        todosContainer.innerHTML = '';
        todos.forEach(todo => {

            todosContainer.innerHTML += 
            `<div class="todo-item ${todo.finished ? 'finished' : 'unfinished'}">
                <span class="todo-text">
                    <div class="todo-category ${todo.category}-indicator"></div>
                    <p class="name">${todo.name}</p>
                </span>
                <div class="todo-buttons">
                    <button class="edit-todo"
                        onclick='handleFinished(${JSON.stringify(todo)})'>
                        ${todo.finished? 'Revert': 'Finish'}
                    </button>
                    <button class="delete-todo" 
                        onclick='handleDelete(${JSON.stringify(todo)})'
                    >Delete</button>
                </div>    
            </div>`       
            
        });
    }
}

// function to store todos on local storage
function storeTodos(){
    localStorage.setItem('todos', JSON.stringify(todos));
}

// function to find the index of an element in an array: todo in todos
function findIndexOf(array, element) {
    let i = 0;
    for(let elem of array) {
        if (elem.id === element.id){
            return i;
        } 
        i++;
    }
}

// change the state of the todo when the user clicks done
function handleFinished(todo){
    let finishFlag = !todo.finished ? true : false;

    let finishedTodo = {
        id: todo.id,
        name: todo.name,
        category: todo.category,
        finished: finishFlag
    }
    
    todos[findIndexOf(todos,todo)] = finishedTodo;
    storeTodos();
    renderTodos(todos);
}

// delete the todo when clicking on delete
function handleDelete(todo){
    let undeleted = todos.filter(elem => elem.id !== todo.id);
    todos = undeleted;
    renderTodos(todos);
    localStorage.setItem('todos',JSON.stringify(todos));
}

// render the todos when the DOM content has loaded
document.addEventListener('DOMContentLoaded', ()=> {
    renderTodos(todos);
})