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

async function updateTask() {
    let updateData = {
        id: 7,
        description: "Updated task description",
        title: "mathimatics",
        category: 9, // Example category ID
        progress: 8, // Example progress percentage
        Due_Date: "2023-12-18", // Example due date
        
        profile: 7 // Example profile ID
    } // this updateDate from the HTML page
    const id = updateData.id;
    const csrftoken = getCookie('csrftoken'); // Get CSRF token from cookie
    try {
        const response = await fetch(`/task/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            throw new Error('Network response was not ok');
        } else {
            const data = await response.json();
            console.log('Task updated successfully: ', data);
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }

}

// Call after DOM is loaded
window.addEventListener('DOMContentLoaded', updateTask);