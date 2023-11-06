window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');
        const taskContent = `
            <div class="content">
                <input type="text" class="text" value="${task.description}" readonly>
            </div>
            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="complete">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            </div>
        `;
        task_el.innerHTML = taskContent;
        return task_el;
    }

    function renderTasks() {
        list_el.innerHTML = '';
        tasks.forEach((task, index) => {
            const task_el = createTaskElement(task);
            const editButton = task_el.querySelector('.edit');
            const deleteButton = task_el.querySelector('.delete');
            const completeButton = task_el.querySelector('.complete');

            editButton.addEventListener('click', () => {
                if (task.completed) return;
                if (editButton.innerText.toLowerCase() == "Edit") {
                    editButton.innerText = "Save";
                    const input = task_el.querySelector('.text');
                    input.removeAttribute("readonly");
                    input.focus();
                } else {
                    editButton.innerText = "Edit";
                    const input = task_el.querySelector('.text');
                    input.setAttribute("readonly", "readonly");
                    tasks[index].description = input.value;
                    saveTasks();
                }
            });

            deleteButton.addEventListener('click', () => {
                if (task.completed) return;
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            completeButton.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            list_el.appendChild(task_el);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            description: input.value,
            completed: false,
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        input.value = '';
    });

    renderTasks();
});
