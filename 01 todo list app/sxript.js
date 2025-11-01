// Get elements from the page
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task when button is clicked
addBtn.addEventListener('click', addTask);

// Also add task when Enter key is pressed
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();

    // Don't add empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add to page
    createTaskElement(task);

    // Save to storage
    saveTaskToStorage(task);

    // Clear input
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <span class="task-date">${new Date(task.id).toLocaleString()}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    const editBtn = li.querySelector('.edit-btn');

    checkbox.addEventListener('change', () => toggleTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    editBtn.addEventListener('click', () => editTask(task.id));

    taskList.appendChild(li);
}

function toggleTask(id) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Update UI
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        const taskText = taskElement.querySelector('.task-text');
        const checkbox = taskElement.querySelector('.task-checkbox');

        if (task.completed) {
            taskText.classList.add('completed');
        } else {
            taskText.classList.remove('completed');
        }
    }
}

function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Remove from page
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    taskElement.remove();
}

function editTask(id) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id === id);

    if (task) {
        const newText = prompt('Edit your task:', task.text);

        if (newText && newText.trim() !== '') {
            task.text = newText.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Update UI
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            const taskText = taskElement.querySelector('.task-text');
            taskText.textContent = task.text;
        }
    }
}

function saveTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => createTaskElement(task));
}