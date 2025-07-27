export function displayErrorMessages(messages) {
    let errorDiv = document.getElementById('login-error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'login-error-message';
        errorDiv.className = 'max-w-md mx-auto mt-4';
        const form = document.querySelector('form');
        if (form && form.parentElement) {
            form.parentElement.insertBefore(errorDiv, form.parentElement.firstChild);
        } else {
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }
    errorDiv.innerHTML = messages.map(msg => `<div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 border border-red-300">${msg}</div>`).join('');
}
