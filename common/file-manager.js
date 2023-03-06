const fs = require("fs");

function createFileIfNotExist(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
        }
    } catch (err) {
        console.log(err.message);
    }
}

function read(filePath, onSuccessData, onErrorData) {
    try {
        createFileIfNotExist(filePath);
        const rawData = fs.readFileSync(filePath);
        return onSuccessData(rawData);
    } catch (err) {
        console.log(err.message);
        return onErrorData();
    }
}

function write(filePath, data) {
    try {
        createFileIfNotExist(filePath);
        fs.writeFileSync(filePath, data);
    } catch (err) {
        console.log(err.message);
    }
}

exports.read = read;
exports.write = write;
