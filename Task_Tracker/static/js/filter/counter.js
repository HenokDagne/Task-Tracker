// Helper to get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// counter.js: Fetch and display task counts from filter endpoints

async function fetchTaskStatusAndCount(endpoint, countId, listId) {
    try {
        const response = await fetch(endpoint);
        if (response.status === 404) {
            console.error('Endpoint not found (404)');
            return;
        }
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Pass the whole object to render
        render(data)
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);

    }
}
window.addEventListener('DOMContentLoaded', () => {
    fetchTaskStatusAndCount('/filter/task-status/completed-count/', 'completedCount', 'completedList');
    fetchTaskStatusAndCount('/filter/task-status/overdue-count/', 'overdueCount', 'overdueList');
    fetchTaskStatusAndCount('/filter/task-status/active-count/', 'activeCount', 'activeList');
    fetchTaskStatusAndCount('/filter/task-status/total-tasks/', 'totalTasksCount', 'totalTasksList');
});

const render = (obj) => {

    const taskSummary = document.getElementById('task-summary');

    if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
            const countElement = document.createElement('div');
            countElement.className = 'flex items-center justify-between mb-2';

            const label = document.createElement('span');
            label.className = 'text-gray-700';
            label.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const valueSpan = document.createElement('span');
            // Set color dynamically based on status (key)
            let bgColor = 'bg-gray-200';
            if (key.toLowerCase().includes('completed')) {
                bgColor = 'bg-green-200';
            } else if (key.toLowerCase().includes('overdue')) {
                bgColor = 'bg-red-200';
            } else if (key.toLowerCase().includes('active')) {
                bgColor = 'bg-blue-200';
            } else if (key.toLowerCase().includes('total')) {
                bgColor = 'bg-yellow-200';
            }
            valueSpan.className = `${bgColor} rounded-full px-3 py-1 text-sm font-semibold`;
            valueSpan.textContent = typeof value === 'number' ? value : (value.count !== undefined ? value.count : '');

            countElement.appendChild(label);
            countElement.appendChild(valueSpan);

            taskSummary.appendChild(countElement);
            
            if (key.toLowerCase().includes('total')) {
                // Calculate completion rate if total tasks is available
                const completed = obj.completed_count || obj.completedCount || (obj.completed && obj.completed.count) || 0;
                const total = Number(value.count !== undefined ? value.count : value);
                const completedNum = Number(obj.completed_count || obj.completedCount || (obj.completed && obj.completed.count) || 0);
                const rate = total > 0 ? Math.round((completedNum / total) * 100) : 0;

                // Create completion rate container
                const rateContainer = document.createElement('div');
                rateContainer.className = 'mt-4';

                const rateLabel = document.createElement('div');
                rateLabel.className = 'text-gray-700 mb-1';
                rateLabel.textContent = 'Completion Rate';
                rateContainer.appendChild(rateLabel);

                const barBg = document.createElement('div');
                barBg.className = 'w-full bg-gray-200 h-2 rounded-full overflow-hidden';

                const barFill = document.createElement('div');
                let barColor = 'bg-red-400';
                if (rate >= 80) {
                    barColor = 'bg-green-400';
                } else if (rate >= 50) {
                    barColor = 'bg-yellow-400';
                } else if (rate >= 30) {
                    barColor = 'bg-purple-400';
                }
                barFill.className = `${barColor} h-2 rounded-full`;
                barFill.style.width = `${rate}%`;
                barBg.appendChild(barFill);
                rateContainer.appendChild(barBg);

                const rateText = document.createElement('div');
                rateText.className = 'text-xs mt-1';
                rateText.style.color = barColor.replace('bg-', '').replace('-400', '');
                rateText.textContent = `${rate}% Complete`;
                rateContainer.appendChild(rateText);

                taskSummary.appendChild(rateContainer);
            }
        });
    } else {
        console.log('Task Data:', obj);
    }
};



