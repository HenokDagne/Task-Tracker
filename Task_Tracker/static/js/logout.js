// Logout handler for Django REST API
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

window.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const csrftoken = getCookie('csrftoken');
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('/user/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                console.log('Logout successful:', result.message);
                localStorage.removeItem('authToken');
                // Optionally redirect after logout
                // window.location.href = '/login';
            } else {
                console.error('Logout error:', result.message || result);
            }
        } catch (error) {
            console.error('Network/logout error:', error);
        }
    });
});
