export const validateNameLength = (name) => {
    return name.length >= 2 && name.length <= 40;
}

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

export const validateUsernameLength = (username) => {
    return username.length >= 4 && username.length <= 20;
}

export const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_-]{4,20}$/;
    return regex.test(username);
}

export const validateHeight = (height) => {
    return height > 0 && height <= 2.5;
}

export const validateWeight = (weight) => {
    return weight > 20 && weight <= 400;
}

export const validateBirthDate = (birthDate) => {
    const today = new Date();
    const minBirthDate = new Date(1940, 0, 1);
    const birthDateDate = new Date(birthDate);

    return birthDate.length > 0 && birthDateDate <= today && birthDateDate >= minBirthDate
}

export const validateLocation = (location) => {
    const regex = /^[a-zA-Z0-9\s,'-]*$/;
    return location === '' || regex.test(location);
}
