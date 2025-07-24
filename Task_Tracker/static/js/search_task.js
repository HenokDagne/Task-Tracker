
function searchTask() {
    const searchInput = document.getElementById('search-bar');
    if (!searchInput) return;
    searchInput.addEventListener('input', async function (event) {
        const query = event.target.value.trim();
        if (!query) return;
        try {
            const response = await fetch(`/task/task-by-name/?name=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
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
        data.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'rounded-lg shadow bg-white p-6 flex flex-col gap-2 border border-gray-200';
           
            border.appendChild(taskCard);
        });
        
      


       
   }
}   
searchTask();