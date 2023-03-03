const express = require('express');
const router = express.Router();
const fs = require("fs");

const SignUpModel = require('../models/sign-up-model');

function readDatabase() {
    const jsonData = fs.readFileSync("databases/sign-up-records.json");
    try {
        return JSON.parse(jsonData);
    } catch (err) {
        return [];
    }
}

// sign in
router.post("/sign-in", function(req, res) {
    // fetch data from database
    const records = readDatabase();
    const doesExistModel = records.find(model => {
        return model.m_studentId === req.body.studentId &&
            model.m_firstName === req.body.firstName &&
            model.m_lastName === req.body.lastName
    });
    if (doesExistModel) {
        res.json(doesExistModel);
        return;
    }
    res.sendStatus(401);
});

// sign up 
router.post("/sign-up", function(req, res) {
    let model = new SignUpModel(req.body);
    try {

        if (model && model.isValid()) {
            // save to file
            let records = readDatabase();
            const doesExist = records.find(record => record.m_studentId === model.m_studentId);
            if (!doesExist) {
                records.push(model);
                fs.writeFileSync("databases/sign-up-records.json", JSON.stringify(records));
                res.json(model);
                return;
            }
            res.sendStatus(500);
        }
    }catch(err) {
        res.status(500).send(err.message);
    }
});

router.get("/list", function(req, res) {
    res.json(readDatabase());
});

module.exports = router; 
