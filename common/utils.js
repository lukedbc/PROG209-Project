function isEmpty(value) {
    return !value || value.length === 0;
}

function isEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function generateId() {
    return Math.random().toString(16).slice(5);
}

function parseDate(value) {
    return new Date(value);
}

exports.isEmpty = isEmpty;
exports.isEmail = isEmail;
exports.generateId = generateId;
exports.parseDate = parseDate;
