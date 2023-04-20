export const parseWeight = (value) => {
    if (value.length > 0) {
        const regex = /^[0-9]*$/;
        if (!regex.test(value)) {
            return value.substring(0, value.length - 1);
        }
    }

    return value;
}
