function searchTask(){
   const searchInput = document.getElementById('search-bar'); // no '#'
    searchInput.addEventListener('change', async function () {
        const searchValue = searchInput.value.trim();
        if (searchValue.length === 0) {
            return; // No input, do nothing
        }

        try {
            const response = await fetch(`/task/task-by-name/?name=${encodeURIComponent(searchValue)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Process the data as needed, e.g., update the UI
            console.log(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
        
    });
}

// Call after DOM is loaded
window.addEventListener('DOMContentLoaded', searchTask);