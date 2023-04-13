export const validateName = (name) => {
    const trimmedName = name.trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(trimmedName);
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validatePassword = (password) => {
    return password.length >= 6;
}

export const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_-]{6,20}$/;
    return regex.test(username);
}

export const validateHeight = (height) => {
    return height > 0 && height <= 3;
}

export const validateWeight = (weight) => {
    return weight > 20 && weight <= 300;
}

export const validateDate = (birthDate) => {
    return birthDate.length > 0;
}

export const validateLocation = (location) => {
    return location.length > 0;
}
