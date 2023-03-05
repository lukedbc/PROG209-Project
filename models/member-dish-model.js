const utils = require("../common/utils");
function AddDish({
    _contestantId,
    _title,
    _picture,
    _difficulty,
    _description,
    _recipe
}) {
    this.m_contestantId = _contestantId;
    this.m_title = _title;
    this.m_picture = _picture;
    this.m_difficulty = _difficulty;
    this.m_description = _description;
    this.m_recipe = _recipe;
}



AddDish.prototype.getPicture = function() {
    return this.m_picture;
}

AddDish.prototype.isValid = function() {
    if (utils.isEmpty(this.m_title)) {
        throw new Error("Missing Title");
    }
    if (utils.isEmpty(this.m_contestantId)) {
        throw new Error("Missing Contestant Id");
    }

    if (utils.isEmpty(this.m_picture)) {
        throw new Error("Missing Picture");
    }

    if (utils.isEmpty(this.m_difficulty)) {
        throw new Error("Missing Difficulty");
    }

    if (utils.isEmpty(this.m_description)) {
        throw new Error("Missing Description");
    }

    if (utils.isEmpty(this.m_recipe)) {
        throw new Error("Missing Recipe");
    }
    return true;
}

module.exports = AddDish;