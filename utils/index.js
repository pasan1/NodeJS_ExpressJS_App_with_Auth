function isNull(data) {
    if (typeof data === 'undefined') {
        return true;
    }
    return data === null || data === undefined;
}

function isBlank(data) {
    if (isNull(data)) {
        return true;
    }
    if (typeof data === 'string') {
        return data.trim().length === 0;
    }
    if (Array.isArray(data)) {
        return data.length === 0;
    }
    if (typeof data === 'object') {
        return Object.keys(data).length === 0;
    }
    return false;
}

module.exports = {
    isBlank,
};