const express = require('express');
const router = express.Router();

const DishModel = require("../models/member-dish-model");
const fileManager = require("../common/file-manager");
const config = require("../config");

function readDishDatabase() {
    return fileManager.read(config.database.dishesFolder(), function(rawData) {
        return JSON.parse(rawData);
    }, function() {
        return [];
    });
}

// show dish
router.get("/show-dish", function(req, res) {
    let dishRecords = readDishDatabase();
    const doesDishExistModel = dishRecords.filter(dishModel => {
        return dishModel.m_contestantId === req.query.contestantId;
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
            fileManager.write(config.database.dishesFolder(), JSON.stringify(dishRecords));
            res.json(model);
            return;
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
