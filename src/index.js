var arrayMatchRegex = /([^\[]+)\[(\d+)]$/;

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
 * @param {String} key
 * @param {*} val
 * @param {Object} tgt
 */
function _set(key, val, tgt) {
    var i, ii;

    if ( ! key) {
        return undefined;
    }

    path = key.split('.');

    key = path.pop();


    for (i = 0, ii = path.length; i < ii; i++) {
        var arrayMatch = path[i].match(arrayMatchRegex);
        if (arrayMatch && arrayMatch.length > 2) {
            var propertyName = arrayMatch[1];
            var arrayIndex = arrayMatch[2];

            if (!tgt[propertyName]) {
                Vue.set(tgt, propertyName, {});
            }
            if (!tgt[propertyName][parseInt(arrayIndex)]) {
                Vue.set(tgt[propertyName], arrayIndex, {});
            }
            tgt = tgt[propertyName][parseInt(arrayIndex)];
        } else {
            if (!tgt[path[i]]) {
                Vue.set(tgt, path[i], {});
            }
            tgt = tgt[path[i]];
        }
    }

    if (_isObj(tgt[key]) && _isObj(val)) {
        _merge(tgt[key], val);

        return;
    }

    Vue.set(tgt, key, val);
}

/**
 * Get a target field with dot notation key.
 * 
 * @param {String} key
 * @param {Object} tgt
 */
function _get(key, tgt) {
    var i, ii;

    if ( ! key) {
        return undefined;
    }

    path = key.split('.');

    for (i = 0, ii = path.length; i < ii; i++) {
        var arrayMatch = path[i].match(arrayMatchRegex);
        if (arrayMatch && arrayMatch.length > 2) {
            var propertyName = arrayMatch[1];
            var arrayIndex = arrayMatch[2];

            if (!tgt[propertyName]) {
               return tgt[propertyName];
            }
            if (!tgt[propertyName][parseInt(arrayIndex)]) {
                return tgt[propertyName][parseInt(arrayIndex)];
            }
            tgt = tgt[propertyName][parseInt(arrayIndex)];
        } else {
            if (!tgt[path[i]]) {
                return tgt[path[i]];
            }
            tgt = tgt[path[i]];
        }
    }

    return tgt;
}

module.exports = {
    set: _set,
    get: _get,
    merge: _merge
};