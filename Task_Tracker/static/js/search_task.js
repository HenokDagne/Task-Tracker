import {deleteTask} from './delete.js';
function searchTask() {
    const searchInput = document.getElementById('search-bar');
    if (!searchInput) return;
    searchInput.addEventListener('change', async function (event) {
        const query = event.target.value.trim();
        if (!query) return;
        try {
            const token = localStorage.getItem('authToken'); // Get token from storage
            const response = await fetch(`/task/task-by-name/?name=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                
                
                render(data);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });

    const render = (data) => {
        const border = document.querySelector('#board');
        if (!border) return;
        if (!Array.isArray(data) || data.length === 0) {
            console.log('No tasks found');
            return;
        }
        data.forEach(task => {
            // Use task.progress, task.title, etc.
            const card = document.createElement('div');
            card.className = 'rounded-lg shadow bg-white p-6 flex flex-col gap-2 border border-gray-200';

            // Top row: status and details
            const topRow = document.createElement('div');
            topRow.className = 'flex items-center justify-between mb-2';

            // Status circle
            const statusCircle = document.createElement('span');
            statusCircle.className = 'w-5 h-5 rounded-full border flex items-center justify-center mr-2';

            // Status and overdue
            let isOverdue = false;
            let statusText = document.createElement('span');
            statusText.className = 'font-bold text-lg';
            let due = task.Due_Date ? new Date(task.Due_Date) : null;
            let today = new Date();
            today.setHours(0,0,0,0);
            if (due) due.setHours(0,0,0,0);

            if (task.progress == 10) {
                statusCircle.classList.add('bg-green-400', 'border-green-400');
                statusText.textContent = task.title;
                statusText.classList.add('line-through', 'text-gray-400');
            } else if (task.progress == 0) {
                statusCircle.classList.add('bg-white', 'border-gray-400');
                statusText.textContent = task.title;
            } else {
                statusCircle.classList.add('bg-blue-400', 'border-blue-400');
                statusText.textContent = task.title;
            }

            // Overdue badge
            let overdueBadge = null;
            if (task.progress < 10 && due && due < today) {
                isOverdue = true;
                overdueBadge = document.createElement('span');
                overdueBadge.className = 'ml-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full';
                overdueBadge.textContent = 'Overdue';
            }

            // Status/active/completed badge
            let stateBadge = document.createElement('span');
            if (task.progress == 10) {
                stateBadge.className = 'bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full';
                stateBadge.textContent = 'Completed';
            } else {
                stateBadge.className = 'bg-black text-white text-xs font-semibold px-3 py-1 rounded-full';
                stateBadge.textContent = 'Active';
            }

            // View details button
            let viewBtn = document.createElement('button');
            viewBtn.className = 'ml-2 bg-white border border-gray-200 px-4 py-1 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition';
            viewBtn.textContent = 'View Details';

            // Top row assembly
            let left = document.createElement('div');
            left.className = 'flex items-center';
            left.appendChild(statusCircle);
            left.appendChild(statusText);
            if (overdueBadge) left.appendChild(overdueBadge);
            topRow.appendChild(left);

            let right = document.createElement('div');
            right.className = 'flex items-center gap-2';
            right.appendChild(stateBadge);
            right.appendChild(viewBtn);
            topRow.appendChild(right);

            // Description row
            let desc = document.createElement('div');
            desc.className = 'text-gray-600 text-base mb-2';
            desc.textContent = `Description: ${task.description || ''}`;

            // Meta row (date, comments, priority, category)
            let meta = document.createElement('div');
            meta.className = 'flex items-center gap-4 text-gray-500 text-sm mt-2';

            // Date
            let dateDiv = document.createElement('div');
            dateDiv.className = 'flex items-center gap-1';
            dateDiv.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg>`;
            dateDiv.append(due ? due.toLocaleDateString() : 'No date');

            // Comments (static 0)
            let commentsDiv = document.createElement('div');
            commentsDiv.className = 'flex items-center gap-1';
            commentsDiv.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2'/></svg>`;
            commentsDiv.append('0 comments');

            // Priority (static High)
            let priorityDiv = document.createElement('span');
            priorityDiv.className = 'bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-semibold';
            priorityDiv.textContent = 'High';

            // Category (show first if exists)
            let catDiv = document.createElement('span');
            catDiv.className = 'bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold';
            if (Array.isArray(task.Category) && task.Category.length > 0) {
                catDiv.textContent = task.Category[0];
            } else {
                catDiv.textContent = 'No Category';
            }
            meta.append(dateDiv, commentsDiv, priorityDiv, catDiv);

            // Delete button
            let deleteBtn = document.createElement('button');
            deleteBtn.className = 'mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors w-32';
            deleteBtn.id = 'deleteBtn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                deleteTask(task)
                    .then(() => card.remove())
                    .catch(err => alert('Failed to delete task: ' + err));
            };

            // Assemble card
            card.appendChild(topRow);
            card.appendChild(desc);
            card.appendChild(meta);
            card.appendChild(deleteBtn);
            border.insertBefore(card, border.firstChild);
        });
        
      


       
   }
}   
searchTask();