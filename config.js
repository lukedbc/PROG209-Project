module.exports = {
    numberOfTeam: 3,
    numberOfMemberEachTeam: 5,
    database: {
        rootFolder: "databases",
        userFolder: function() {
            return this.rootFolder + "/" + "sign-up-records.json";
        },
        memberSlotFolder: function() {
            return this.rootFolder + "/" + "member-slot-records.json";
        },
        dishesFolder: function() {
            return this.rootFolder + "/" + "member-dish-records.json";
        }
    }
} 
