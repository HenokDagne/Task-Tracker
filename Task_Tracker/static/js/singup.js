
import {validateSignupForm} from './signup_validation.js';
import {displayErrorMessages} from './error_message.js';

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


        // Convert FormData to plain object for JSON, always include confirm_password
        const data = {
            username: formData.get('username') || '',
            email: formData.get('email') || '',
            password: formData.get('password') || '',
            confirm_password: formData.get('confirm_password') || '',
            first_name: formData.get('first_name') || '',
            last_name: formData.get('last_name') || ''
        };
        // validate the form data
        const  errors = validateSignupForm(dataForValidation);
        if (errors && Object.keys(errors).length > 0) {
            displayErrorMessages(Object.values(errors));
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
                displayErrorMessages([errorData.message || 'Signup failed']);
            }
            else {
                // You can show a success message or redirect here
                // displayErrorMessages(['User created successfully']);
                console.log('User created successfully');
            }
        } catch (error){
            displayErrorMessages(['Error creating user']);
        }
    })
}
formSubmit();