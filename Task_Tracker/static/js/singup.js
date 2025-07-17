

import {validateSignupForm} from './signup_validation.js';
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


const formSubmit = () =>{
    const form = document.querySelector('#signupForm');
    form.addEventListener('submit', async(event) =>{
        event.preventDefault(); // prevent default form submission
        const formData = new FormData(form);
        const csrftoken = getCookie('csrftoken');
        
        
        // Get CSRF token from cookie
        const dataForValidation = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name')
        }

        // Convert FormData to plain object for JSON
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name')
        };
        // validate the form data
        if(!validateSignupForm(dataForValidation)) {
            const errorMessage = validateSignupForm(data);
            console.error('validation error: ', errorMessage);
            return; // Stop submission if validation fails
        }
        
        try {
            const response = await fetch(`/user/signup/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error: ', errorData);
            }
            else {
                console.log('User created successfully');
            }
        } catch (error){
            console.error('Error creating user: ', error);
        }
    })
}
formSubmit();