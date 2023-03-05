const { warn } = require('console');
const express = require('express');
const router = express.Router();
const fs = require("fs");

const config = require("../config");
const MemberSlot = require('../models/member-slot-model');

function generateDefaultMemeberSlot(numberOfTeam, numberOfMemberEachTeam) {
    let result = [];
    for (let i = 0; i < numberOfTeam; i++) {
        result[i] = [];
        for (let j = 0; j < numberOfMemberEachTeam; j++) {
            result[i][j] = {
                m_text: "Available to join",
                m_slotTaken: false,
                m_constestantId: ""
            };
        }
    }
    return result;
}

function readDatabase() {
    if (!fs.existsSync("databases/member-slot-records.json")) {
        fs.writeFileSync("databases/member-slot-records.json", "");
    }
    const jsonData = fs.readFileSync("databases/member-slot-records.json");
    try {
        let data = JSON.parse(jsonData);
        return new MemberSlot(data);
    } catch (err) {
        return new MemberSlot(
            generateDefaultMemeberSlot(config.numberOfTeam, config.numberOfMemberEachTeam)
        );
    }
}

router.get("/info", function(req, res) {
    // fetch data from database
    const records = readDatabase();
    res.json(records.m_data);
});

router.post("/assign", function(req, res) {
    const memberSlot = readDatabase();
    const { team, memberOrder, text, contestantId } = req.body;
    const result = memberSlot.assignMatrixSlot({
        _team: team,
        _memberOrder: memberOrder,
        _newText: text,
        _contestantId: contestantId
    });
    if (result.status) {
        res.status(200).send(result.message);
        fs.writeFileSync("databases/member-slot-records.json", JSON.stringify(memberSlot.m_data));
        return;
    }
    res.status(500).send(result.message);
});

module.exports = router; 
