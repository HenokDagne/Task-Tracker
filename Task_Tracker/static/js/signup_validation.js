import validator from 'validator';
export const validateSignupForm = (formData) => {
    const errors = {};
    const requiredFields = ['username', 'email', 'password', 'first_name', 'last_name'];
    requiredFields.forEach(field => {
        if(!formData[field]){
            errors[field] = `${field.replace('_', ' ')} is required`;
        }
    });
    if(formData.password && formData.confirm_password && formData.password !== formData.confirm_password){
        errors['confirm_password'] = 'Passwords do not match';
        return errors;
    }
    if(validator.isEmail(formData.email)){
        
    }



    
}