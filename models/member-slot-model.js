function MemberSlot(data) {
    this.m_data = data;
}

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

MemberSlot.prototype.assignMatrixSlot = function({
    _team,
    _memberOrder,
    _newText,
    _contestantId
}) {
    let slot = this.m_data[_team - 1][_memberOrder - 1];

    if (!slot) {
        return { status: false, message: `Slot ${_team}-${_memberOrder} is not found` };
    }

    if (slot.m_slotTaken) {
        return { status: false, message: "This spot is taken" };
    }

    let constestantJoinStatus = this.find(function(slot) {
        return slot.m_constestantId === _contestantId;
    });

    if (constestantJoinStatus) { // did join;
        return { status: false, message: "You've already signed up" };
    }

    slot.m_text = _newText;
    slot.m_slotTaken = true;
    slot.m_constestantId = _contestantId;

    this.m_data[_team - 1][_memberOrder - 1] = slot;
    return { status: true, message: "success" };
}

MemberSlot.prototype.getSlot = function(team, memberOrder) {
    return this.m_data[team - 1][memberOrder - 1];
}

MemberSlot.prototype.isTaken = function(team, memberOrder) {
    let slot = this.m_data[team - 1][memberOrder - 1];
    if (!slot) {
        console.log(`Slot ${team}-${memberOrder} is not found`);
        return false;
    }

    return slot.m_slotTaken;
}

MemberSlot.prototype.find = function(filterFunction) {
    for (let i = 0, numberOfTeam = this.m_data.length; i < numberOfTeam; i++) {
        for (let j = 0, numberOfMemberEachTeam = this.m_data[i].length; j < numberOfMemberEachTeam; j++) {
            if (filterFunction(this.m_data[i][j])) {
                return this.m_data[i][j];
            }
        }
    }
    return null;
}

module.exports = MemberSlot;
