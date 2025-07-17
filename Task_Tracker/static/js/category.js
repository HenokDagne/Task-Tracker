
async function fetchTasks() {
    try {
        const response = await fetch('/category/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else {
            const data = await response.json();
            for (const category of data){
                console.log(`Category name: ${category.name}`)
            }
        } 

    
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}



// Call on page load
window.addEventListener('DOMContentLoaded', fetchTasks);