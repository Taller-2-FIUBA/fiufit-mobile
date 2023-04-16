export const parseHeight = (value) => {
    let newValue = value.toString();
    let arr = newValue.replace(" cm", "").split("");
    arr.splice(1, 0, ".");
    let ret = parseFloat(arr.join(""));
    console.log(ret);
    return ret;
}

export const parseWeight = (value) => {
    if (value > 400) {
        return 400;
    }

    if (value !== 0) {
        let newValue = value.toString();
        const regex = /^[0-9]*$/;
        if (!regex.test(newValue)) {
            newValue = newValue.substring(0, newValue.length - 1);
            return newValue;
        }
    }

    return value;
}
