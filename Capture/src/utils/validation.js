//signup email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email == "") return { valid: false, error: "Email is required." };
    if (!regex.test(email)) return { valid: false, error: "Invalid email format." };
    return { valid: true, error: "no error" };
};
  
//signup password
export const validatePassword = (password) => {
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
if (!password) return { valid: false, error: "Password is required." };
if (password.length < 8)
    return { valid: false, error: "Password must be at least 8 characters long." };
if (!regex.test(password))
    return {
    valid: false,
    error:
        "Password must include an uppercase letter, lowercase letter, number, and special character.",
    };
return { valid: true, error: "no error" };
};
  
//signup username
export const validateUsername = (username) => {
const regex = /^[a-zA-Z0-9_]{3,15}$/;
if (!username) return { valid: false, error: "Username is required." };
if (username.length < 3)
    return { valid: false, error: "Username must be at least 3 characters long." };
if (username.length > 15)
    return { valid: false, error: "Username cannot exceed 15 characters." };
if (!regex.test(username))
    return {
    valid: false,
    error: "Username can only contain letters, numbers, and underscores.",
    };
return { valid: true, error: "no error" };
};

//signup confirm password
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return { valid: false, error: "Please confirm your password." };
    if (password !== confirmPassword)
      return { valid: false, error: "Passwords do not match." };
    return { valid: true, error: "no error" };
};

//signin password
export const validateSignInPassword = (password) => {
    if (!password) return { valid: false, error: "Password is required." };
    if (password.length < 6)
        return { valid: false, error: "Password must be at least 6 characters long." };
    return { valid: true, error: "no error" };
};