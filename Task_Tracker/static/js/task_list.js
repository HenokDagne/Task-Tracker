export async function fetchTasks() {
    try {
        const response = await fetch('/task/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}



// Call on page load
window.addEventListener('DOMContentLoaded', fetchTasks);