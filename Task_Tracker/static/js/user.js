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

// user.js
async function fetchCurrentUserEmail() {
    try {
        const csrftoken = getCookie('csrftoken');
        const token = localStorage.getItem('authToken');
        const response = await fetch('/user/current-user-email/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${token}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        renderEmail(data.email)
    } catch (error) {
        console.error('Error fetching user email:', error);
    }
}

const renderEmail = (email) => {
    const emailspan = document.querySelector('#email-display');
    emailspan.textContent = email;
}
   

window.addEventListener('DOMContentLoaded', fetchCurrentUserEmail);