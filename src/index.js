
function _isObj(val) {
    if (val !== null && typeof val === 'object' && val.constructor !== Array ) {
        return true;
    }

    return false;
}


function _merge(tgt, src) {
    var i;

    for (i in src) {
        if (_isObj(tgt[i]) && _isObj(src[i])) {
            _merge(tgt[i], src[i]);
        }
        else {
            Vue.set(tgt, i, src[i]);
        }
    }
}

/**
 * Set a target field with dot notation key/val.
 * 
 * @param String key
 * @param Mixed val
 * @param Object tgt
 */
function _set(key, val, tgt) {
    var i, ii, obj;

    if ( ! key) {
        return undefined;
    }

    obj = tgt;
    path = key.split('.');

    key = path.pop();

    for (i = 0, ii = path.length; i < ii; i++) {
        if (!tgt[path[i]]) {
            Vue.set(tgt, path[i], {});
        }

        tgt = tgt[i];
    }

    if (_isObj(tgt[key]) && _isObj(val)) {
        _merge(tgt[key], val);

        return;
    }

    tgt[key] = val;
}

/**
 * Get a target field with dot notation key.
 * 
 * @param String key
 */
function _get(key, tgt) {
    var i, ii, obj;

    if ( ! key) {
        return undefined;
    }

    path = key.split('.');

    for (i = 0, ii = path.length; i < ii; i++) {
        if (!tgt[path[i]]) {
            return tgt[path[i]];
        }

        tgt = tgt[path[i]];
    }

    return tgt;
}

module.exports = {
    set: _set,
    get: _get,
    merge: _merge
};