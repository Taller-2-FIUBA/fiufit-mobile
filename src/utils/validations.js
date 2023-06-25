export const validateNameLength = (name) => {
    return name.length >= 2 && name.length <= 40;
}

export const validateName = (name) => {
    const trimmedName = name.trim();
    return name === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedName);
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

export const validateHeightMeters = (meters) => {
    const regex = /^(0|[1-2])$/;
    return regex.test(meters);
}

export const validateHeightCentimeters = (centimeters) => {
    const regex = /^(0|[1-9]\d?)$/;
    return regex.test(centimeters);
}

export const validateHeight = (height) => {
    const parsedHeight = parseFloat(height);
    return parsedHeight > 0.5 && parsedHeight <= 2.5;
}

export const validateWeight = (weight) => {
    const regex = /^([2-9][0-9]|[1-3][0-9]{2}|400)$/;
    return regex.test(weight);
}

export const validateBirthDate = (birthDate) => {
    const today = new Date();
    const minBirthDate = new Date(1940, 0, 1);
    const birthDateDate = new Date(birthDate);

    return birthDate.length > 0 && birthDateDate <= today && birthDateDate >= minBirthDate
}

export const validateLocation = (location) => {
    const containsOnlyNumbersAndSpaces = /^\d[\d\s]*$/.test(location);
    const containsOnlyLettersAndSpecialChars = /^[a-zA-Z0-9\s,'\p{L}]*$/u.test(location);
    return !containsOnlyNumbersAndSpaces && (location === '' || containsOnlyLettersAndSpecialChars);
}

export const validateGoalTitle = (title, isHelperText) => {
    if (isHelperText && title.length === 0) {
        return true;
    }
    return title.length >= 1 && title.length <= 15;
}

export const validateGoalDescription = (description, isHelperText) => {
    if (isHelperText && description.length === 0) {
        return true;
    }
    return description.length >= 1 && description.length <= 30;
}

export const validateGoalObjective = (objective, isHelperText) => {
    if (isHelperText && objective.length === 0) {
        return true;
    }
    const regex = /^[0-9]+$/;
    return regex.test(objective);
}

export const validateTrainingName = (name) => {
    const trimmedName = name.trim();
    return name === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedName);
}

export const validateTrainingNameLength = (name) => {
    return name.length >= 3 && name.length <= 40;
}

export const validateDescriptionLength = (name) => {
    return name.length >= 3 && name.length <= 100;
}

export const validateMediaUrl = (url) => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
    return regex.test(url);
}

export const validateAmount = (amount, isHelperText) => {
    if (isHelperText && amount.length === 0) {
        return true;
    }

    if (!/^(\d{1,3}(\.\d{1,3})?)?$/.test(amount)) {
        return false;
    }

    const number = parseFloat(amount);

    return !(isNaN(number) || number < 0 || number > 1000 || number.toString() !== amount || (amount.includes('.')
        && amount.split('.')[1].length > 3));
}

export const validateWallet = (address, isHelperText) => {
    if (isHelperText && address.length === 0) {
        return true;
    }

    const regex = /^0x[A-Fa-f0-9]+$/;
    return regex.test(address);
}

export const validateTransferUsername = (username, isHelperText) => {
    if (isHelperText && username.length === 0) {
        return true;
    }

    return validateUsername(username);
}
