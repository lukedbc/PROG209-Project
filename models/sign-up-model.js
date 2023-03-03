const utils = require("../common/utils");
function SignUpModel({
    _id = utils.generateId(),
    _studentId,
    _firstName,
    _lastName,
    _gender,
    _major,
    _dob,
    _experience,
    _reason,
    _other,
    _createdDate = new Date(),
}) {
    this.m_id = _id;
    this.m_studentId = _studentId;
    this.m_firstName = _firstName;
    this.m_lastName = _lastName;
    this.m_gender = _gender;
    this.m_major = _major;
    this.m_dob = _dob;
    this.m_experience = _experience;
    this.m_reason = _reason;
    this.m_other = _other;
    this.m_createdDate = _createdDate;
}

SignUpModel.prototype.isValid = function() {

    if (utils.isEmpty(this.m_id)) {
        throw new Error("Missing ID");
    }

    if (utils.isEmpty(this.m_studentId)) {
        throw new Error("Missing studentId");
    }

    if (utils.isEmpty(this.m_firstName)) {
        throw new Error("Missing firstName");
    }

    if (utils.isEmpty(this.m_lastName)) {
        throw new Error("Missing lastName");
    }

    if (utils.isEmpty(this.m_gender)) {
        throw new Error("Missing gender");
    }

    if (utils.isEmpty(this.m_dob)) {
        throw new Error("Missing DOB");
    }

    if (utils.isEmpty(this.m_experience)) {
        throw new Error("Missing experience");
    }

    if (utils.isEmpty(this.m_reason)) {
        throw new Error("Missing reason");
    }

    const dobAsDate = utils.parseDate(this.m_dob);
    const today = new Date();

    if (dobAsDate > today) {
        throw new Error("DOB is greater than the current day");
    }

    let age = today.getFullYear() - dobAsDate.getFullYear();
    let m = today.getMonth() - dobAsDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobAsDate.getDate())) {
        age--;
    }

    if (age < 18) {
        throw new Error("At least 18 years old");
    }

    return true;
}


module.exports = SignUpModel;
