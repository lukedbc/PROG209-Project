const fs = require("fs");

function read(filePath, onSuccessData, onErrorData) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
        }
        const rawData = fs.readFileSync(filePath);
        return onSuccessData(rawData);
    } catch (err) {
        console.log(err.message);
        return onErrorData();
    }
}

function write(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
    } catch (err) {
        console.log(err.message);
    }
}

exports.read = read;
exports.write = write;
