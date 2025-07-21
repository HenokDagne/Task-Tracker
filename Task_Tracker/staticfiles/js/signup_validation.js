
export const validateSignupForm = (formData) => {
    const errors = {};
    const requiredFields = ['username', 'email', 'password', 'first_name', 'last_name', 'confirm_password'];
    requiredFields.forEach(field => {
        if(!formData[field]){
            errors[field] = `${field.replace('_', ' ')} is required`;
        }
    });

    if(!validator.isEmail(formData.email)){
        errors['email'] = 'Invalid email format';
        return errors;
    }

    // Only run further checks if password and confirm_password are present
    if(formData.password && formData.confirm_password) {
        if(formData.password !== formData.confirm_password){
            errors['confirm_password'] = 'Passwords do not match';
            return errors;
        }
       
        // Use validator.isStrongPassword for uppercase, lowercase, number
        const isValid = validator.isStrongPassword(formData.password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        });
        if (!isValid) {
            errors['password'] = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            return errors;
        }
    }



    
}


