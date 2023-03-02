function Storage(_name) {
    this.m_name = _name;
    this.m_data = [];
}

function Storage(_name, _data) {
    this.m_name = _name;
    if (!_data) {
        this.m_data = [];
    } else {
        this.m_data = _data;
    }
}

Storage.prototype.getAll = function() {
    return this.m_data;
}

Storage.prototype.assignData = function(data) {
    this.m_data = data;
}


Storage.prototype.getLength = function() {
    return this.m_data.length;
}

Storage.prototype.getIndexOfId = function(value) {
    for (i = 0; i < this.m_data.length; i++) {
        if (this.m_data[i].m_id == value) return i;
    }
    return -1;
}

Storage.prototype.getName = function() {
    return this.m_name;
}

Storage.prototype.add = function(value) {
    this.m_data.push(value);
}

Storage.prototype.remove = function(index) {
    this.m_data.splice(index, 1);
}

Storage.prototype.saveToCache = function() {
    putValueToCache(this.m_name, JSON.stringify(this.m_data));
}

Storage.prototype.syncWithCache = function() {
    let cache = getValueFromCache(this.m_name);
    if (cache) {
        this.m_data = JSON.parse(cache);
    } else {
        this.m_data = [];
    }
}

Storage.prototype.syncWithCacheByConverter = function(converter) {
    let cache = getValueFromCache(this.m_name);
    if (cache) {
        this.m_data = converter(JSON.parse(cache));
    } else {
        this.m_data = [];
    }
}

Storage.prototype.clearAll = function() {
    this.m_data = [];
}

Storage.prototype.find = function(filter) {
    return this.m_data.find(function(each) {
        return filter(each);
    });
}
Storage.prototype.filter = function(filter) {
    return this.m_data.filter(function(each) {
        return filter(each);
    });
}

