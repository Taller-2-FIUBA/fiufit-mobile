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
    const regex = /^\d+([,.]\d{1,2})?$/;
    const heightFormatted = parseFloat(height.replace(",", "."));

    if (!heightFormatted || heightFormatted <= 0 || heightFormatted > 2.5) {
        return false;
    }

    return regex.test(height);
}

export const validateWeight = (weight) => {
    const regex = /^\d+([,.]\d{1,2})?$/;
    const weightFormatted = parseFloat(weight.replace(",", "."));

    if (!weightFormatted || weightFormatted <= 0 || weightFormatted > 300) {
        return false;
    }

    return regex.test(weight);
}

export const validateDate = (birthDate) => {
    return birthDate.length > 0;
}

export const validateLocation = (location) => {
    return location.length > 0;
}
