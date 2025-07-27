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

export async function deleteTask(task) {
  
    console.log(task)
    const csrftoken = getCookie('csrftoken');
    const token = localStorage.getItem('authToken'); // Get token from storage
    try {
        const response = await fetch(`/task/delete_task/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${token}`
            },
              // Automatically converted to "username=example&password=password"
             body: JSON.stringify({ name: task }),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = await response.text();
            }
            console.error('Backend error:', errorData);
            throw new Error('Network response was not ok');
        } else {
            console.log('Task deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }

}

