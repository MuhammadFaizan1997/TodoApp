<script>
    // ==========================================================================
    // 1. STATE VARIABLES
    // ==========================================================================
    // Store array of task objects: [{ id: 123, text: 'Buy Milk', completed: false }]
    let tasks = [];
    let currentFilter = 'all';

    // DOM Element Selectors
    const taskForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    // ==========================================================================
    // 2. INITIALIZATION
    // ==========================================================================
    // Load tasks from LocalStorage when the web page finishes loading
    window.onload = function() {
      loadFromLocalStorage();
      renderTasks();
    };

    // Listen for form submit (Add new task)
    taskForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevents page reload
      addTask();
    });

    // ==========================================================================
    // 3. CORE FUNCTIONS (Add, Render, Toggle, Delete, Edit)
    // ==========================================================================

    // ADD A NEW TASK
    function addTask() {
      const text = taskInput.value.trim();

      if (text === '') return; // Don't add empty tasks

      // Create a task object
      const newTask = {
        id: Date.now(), // Generate a unique ID using timestamp
        text: text,
        completed: false
      };

      tasks.push(newTask); // Add to tasks array
      saveToLocalStorage();
      renderTasks();

      taskInput.value = ''; // Reset input field
    }

    // RENDER TASKS TO HTML
    function renderTasks() {
      taskList.innerHTML = ''; // Clear current list

      // Filter tasks based on selected tab ('all', 'pending', 'completed')
      const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
      });

      // Display empty state message if list is empty
      if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks to display</li>';
      } else {
        // Loop over tasks and create HTML elements
        filteredTasks.forEach(function(task) {
          const li = document.createElement('li');
          li.className = `task-item ${task.completed ? 'completed' : ''}`;

          li.innerHTML = `
            <div class="task-content">
              <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
              <span class="task-text" id="text-${task.id}" onclick="toggleTask(${task.id})">${escapeHtml(task.text)}</span>
            </div>
            <div class="task-actions">
              <button class="action-btn btn-edit" onclick="editTask(${task.id})">Edit</button>
              <button class="action-btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
          `;

          taskList.appendChild(li);
        });
      }

      updateCount();
    }

    // TOGGLE TASK COMPLETED STATUS
    function toggleTask(id) {
      tasks = tasks.map(function(task) {
        if (task.id === id) {
          task.completed = !task.completed;
        }
        return task;
      });

      saveToLocalStorage();
      renderTasks();
    }

    // DELETE A SINGLE TASK
    function deleteTask(id) {
      tasks = tasks.filter(function(task) {
        return task.id !== id;
      });

      saveToLocalStorage();
      renderTasks();
    }

    // EDIT AN EXISTING TASK (INLINE)
    function editTask(id) {
      const textSpan = document.getElementById(`text-${id}`);
      const currentText = textSpan.innerText;

      // Replace text with an input element
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'edit-input';
      input.value = currentText;

      textSpan.replaceWith(input);
      input.focus();

      // Save changes when user presses Enter or clicks away (blur)
      function saveEdit() {
        const newText = input.value.trim();
        if (newText !== '') {
          tasks = tasks.map(function(task) {
            if (task.id === id) {
              task.text = newText;
            }
            return task;
          });
          saveToLocalStorage();
        }
        renderTasks();
      }

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') saveEdit();
      });

      input.addEventListener('blur', saveEdit);
    }

    // FILTER TASKS ('all', 'pending', 'completed')
    function filterTasks(filterType, buttonElement) {
      currentFilter = filterType;

      // Update active style on filter buttons
      const buttons = document.querySelectorAll('.filter-btn');
      buttons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      buttonElement.classList.add('active');

      renderTasks();
    }

    // CLEAR ALL COMPLETED TASKS
    function clearCompleted() {
      tasks = tasks.filter(function(task) {
        return !task.completed;
      });

      saveToLocalStorage();
      renderTasks();
    }

    // UPDATE TASK COUNT SUMMARY
    function updateCount() {
      const pendingCount = tasks.filter(function(task) {
        return !task.completed;
      }).length;

      taskCount.innerText = `${pendingCount} task${pendingCount === 1 ? '' : 's'} left`;
    }

    // ==========================================================================
    // 4. LOCAL STORAGE HELPERS
    // ==========================================================================

    function saveToLocalStorage() {
      localStorage.setItem('beginner_todos', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
      const data = localStorage.getItem('beginner_todos');
      if (data) {
        tasks = JSON.parse(data);
      } else {
        // Sample starter tasks for beginner preview
        tasks = [
          { id: 1, text: 'Learn HTML, CSS & JavaScript', completed: true },
          { id: 2, text: 'Build a simple To-Do Application', completed: false }
        ];
      }
    }

    // Utility helper to sanitize HTML text input
    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    }
  </script>