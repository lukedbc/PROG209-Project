const express = require('express');
const router = express.Router();
const fs = require("fs");
const { monitorEventLoopDelay } = require('perf_hooks');

const DishModel = require('../models/member-dish-model');

function readDishDatabase() {
    if (!fs.existsSync("databases/member-dish-records.json")) {
        fs.writeFileSync("databases/member-dish-records.json", "");
    }
    try {
        const jsonData = fs.readFileSync("databases/member-dish-records.json");
        return JSON.parse(jsonData);
    } catch (err) {
        return [];
    }
}

// show dish
router.get("/show-dish", function(req, res) {
    let dishRecords = readDishDatabase();
    const doesDishExistModel = dishRecords.filter(dishModel => {
        return dishModel.m_contestantId == req.query.contestantId;
    });

    if (doesDishExistModel) {
        res.json(doesDishExistModel);
        return;
    }
    res.sendStatus(401);
});

// add dish
router.post("/add-dish", function(req, res) {
    let model = new DishModel(req.body);
    try {
        if (model && model.isValid()) {

            let dishRecords = readDishDatabase();

            dishRecords.push(model);
            fs.writeFileSync("databases/member-dish-records.json", JSON.stringify(dishRecords));
            res.json(model);
            return;
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
