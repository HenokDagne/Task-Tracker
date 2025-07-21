import {fetchCategories} from './category.js';
import {createTask} from './create_task.js';

function Todolist() {

    function addTask() {
        // Attach the event directly, since script is loaded at the end of body
        const addtask = document.querySelector("#addtask");
        if (!addtask) return;
        // Remove any previous event listeners by cloning (optional, but safe)
        const newAddtask = addtask.cloneNode(true);
        addtask.parentNode.replaceChild(newAddtask, addtask);
        newAddtask.addEventListener("click", event => {
            event.preventDefault();
            // Create overlay
            let overlay = document.createElement("div");
            overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
            let formContainer = document.createElement("div");
            formContainer.className = "bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg";
            let form = document.createElement("form");
            form.className = "flex flex-col gap-4";
            let taskLabel = document.createElement("label");
            taskLabel.className = "text-gray-200 font-semibold";
            taskLabel.textContent = "Task Name";
            let taskInput = document.createElement("input");
            taskInput.type = "text";
            taskInput.className = "border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100";
            taskInput.required = true;
            let categoryLabel = document.createElement("label");
            categoryLabel.className = "text-gray-200 font-semibold";
            categoryLabel.textContent = "Category";
            let categorySelect = document.createElement("select");
            categorySelect.className = "border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100";
            categorySelect.required = true;

            // Fetch categories and populate options
            fetchCategories().then(categories => {
              categories.forEach(cat => {
                let option = document.createElement("option");
                option.value = cat.id || cat.name || cat; // adapt as per your backend
                option.textContent = cat.name || cat;
                categorySelect.appendChild(option);
              });
            }).catch(() => {
              let option = document.createElement("option");
              option.value = "";
              option.textContent = "No categories";
              categorySelect.appendChild(option);
            });

           


            let progressLabel = document.createElement("label");
            progressLabel.className = "text-gray-200 font-semibold";
            progressLabel.textContent = "Progress (0-10)";
            let progressInput = document.createElement("input");
            progressInput.type = "number";
            progressInput.min = "0";
            progressInput.max = "10";
            progressInput.className = "border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100";
            progressInput.required = true;
            let dateLabel = document.createElement("label");
            dateLabel.className = "text-gray-200 font-semibold";
            dateLabel.textContent = "Due Date";
            let dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.className = "border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100";
            dateInput.required = true;
            let descriptionLabel = document.createElement("label");
            descriptionLabel.className = "text-gray-200 font-semibold";
            descriptionLabel.textContent = "Description";
            let descriptionInput = document.createElement("textarea");
            descriptionInput.className = "border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 h-24";
            descriptionInput.placeholder = "Enter task description here...333";            
            let submitBtn = document.createElement("button");
            submitBtn.type = "submit";
            submitBtn.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold";
            submitBtn.textContent = "Add Task";
            let cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.className = "bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-semibold";
            cancelBtn.textContent = "Cancel";
            cancelBtn.onclick = () => document.body.removeChild(overlay);
            form.append(
                taskLabel, taskInput,
                categoryLabel, categorySelect,
                progressLabel, progressInput,
                dateLabel, dateInput,
                descriptionLabel, descriptionInput,
                submitBtn, cancelBtn
            );
            formContainer.appendChild(form);
            overlay.appendChild(formContainer);
            document.body.appendChild(overlay);
            form.addEventListener("submit", event => {


                event.preventDefault();
                taskRender(
                    taskInput.value,
                    categorySelect.value,
                    progressInput.value,
                    dateInput.value,
                )
                createTask(
                    taskInput.value,
                    categorySelect.value,
                    progressInput.value,
                    dateInput.value,
                    descriptionInput.value
                ).then(() => {
                    document.body.removeChild(overlay);
                }).catch(error => {
                    console.error('Error creating task:', error);
                });
            });
        });
    }

    addTask();

    function taskRender(task, project, progress, date){
        const taskDiv = document.querySelector("#board");
        // Create card wrapper for task
        const card = document.createElement("div");
        card.className = "rounded-lg shadow bg-white p-6 flex flex-col gap-2 border border-gray-200";
        // Top row: status and details
        const topRow = document.createElement("div");
        topRow.className = "flex items-center justify-between mb-2";
        // Status circle
        const statusCircle = document.createElement("span");
        statusCircle.className = "w-5 h-5 rounded-full border flex items-center justify-center mr-2";
        // Status and overdue
        let isOverdue = false;
        let statusText = document.createElement("span");
        statusText.className = "font-bold text-lg";
        let due = new Date(date);
        let today = new Date();
        today.setHours(0,0,0,0);
        due.setHours(0,0,0,0);
        if(progress == 10) {
          statusCircle.classList.add("bg-green-400", "border-green-400");
          statusText.textContent = task;
          statusText.classList.add("line-through", "text-gray-400");
        } else if(progress == 0) {
          statusCircle.classList.add("bg-white", "border-gray-400");
          statusText.textContent = task;
        } else {
          statusCircle.classList.add("bg-blue-400", "border-blue-400");
          statusText.textContent = task;
        }
        // Overdue badge
        let overdueBadge = null;
        if(progress < 10 && date && due < today) {
          isOverdue = true;
          overdueBadge = document.createElement("span");
          overdueBadge.className = "ml-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full";
          overdueBadge.textContent = "Overdue";
        }
        // Status/active/completed badge
        let stateBadge = document.createElement("span");
        if(progress == 10) {
          stateBadge.className = "bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full";
          stateBadge.textContent = "Completed";
        } else {
          stateBadge.className = "bg-black text-white text-xs font-semibold px-3 py-1 rounded-full";
          stateBadge.textContent = "Active";
        }
        // View details button
        let viewBtn = document.createElement("button");
        viewBtn.className = "ml-2 bg-white border border-gray-200 px-4 py-1 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition";
        viewBtn.textContent = "View Details";
        // Top row assembly
        let left = document.createElement("div");
        left.className = "flex items-center";
        left.appendChild(statusCircle);
        left.appendChild(statusText);
        if(overdueBadge) left.appendChild(overdueBadge);
        topRow.appendChild(left);
        let right = document.createElement("div");
        right.className = "flex items-center gap-2";
        right.appendChild(stateBadge);
        right.appendChild(viewBtn);
        topRow.appendChild(right);
        // Description row
        let desc = document.createElement("div");
        desc.className = "text-gray-600 text-base mb-2";
        desc.textContent = `Project: ${project}`;
        // Meta row (date, comments, priority, category)
        let meta = document.createElement("div");
        meta.className = "flex items-center gap-4 text-gray-500 text-sm mt-2";
        // Date
        let dateDiv = document.createElement("div");
        dateDiv.className = "flex items-center gap-1";
        dateDiv.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg>`;
        dateDiv.append(date ? date : "No date");
        // Comments (static 0)
        let commentsDiv = document.createElement("div");
        commentsDiv.className = "flex items-center gap-1";
        commentsDiv.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2'/></svg>`;
        commentsDiv.append("0 comments");
        // Priority (static High)
        let priorityDiv = document.createElement("span");
        priorityDiv.className = "bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-semibold";
        priorityDiv.textContent = "High";
        // Category (static Work)
        let catDiv = document.createElement("span");
        catDiv.className = "bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold";
        catDiv.textContent = "Work";
        meta.append(dateDiv, commentsDiv, priorityDiv, catDiv);
        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors w-32";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => card.remove();
        // Assemble card
        card.appendChild(topRow);
        card.appendChild(desc);
        card.appendChild(meta);
        card.appendChild(deleteBtn);
        taskDiv.appendChild(card);
    }

}

Todolist();