class Contestant {
    constructor({
        _id = generateId(),
        _studentId,
        _firstName,
        _lastName,
        _gender,
        _dob,
        _major,
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
        this.m_dob = _dob;
        this.m_major = _major
        this.m_experience = _experience;
        this.m_reason = _reason;
        this.m_other = _other;
        this.m_createdDate = _createdDate;
    }

    getName() {
        return this.m_firstName + " " + this.m_lastName;
    }
}

function makeContestantFromCache(cache) {
    return new Contestant({
        _id: cache.m_id,
        _studentId: cache.m_studentId,
        _firstName: cache.m_firstName,
        _lastName: cache.m_lastName,
        _gender: cache.m_gender,
        _major: cache.m_major,
        _dob: cache.m_dob,
        _experience: cache.m_experience,
        _reason: cache.m_reason,
        _other: cache.m_other,
    });
}
