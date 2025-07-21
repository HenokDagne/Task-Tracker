// Login form handler for Django REST API
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

const loginFormHandler = () => {
    const form = document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const csrftoken = getCookie('csrftoken');

        try {
            const response = await fetch('/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (response.ok && result.token) {
                console.log('Login successful! Token:', result.token);
                localStorage.setItem('authToken', result.token);
                // Redirect or show success message
            } else {
                console.error('Login error:', result.message || result);
            }
        } catch (error) {
            console.error('Network/login error:', error);
        }
    });
};

window.addEventListener('DOMContentLoaded', loginFormHandler);
