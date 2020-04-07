const Vue = require('vue').default || require('vue'); // Ugly hack to support any type of environment

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

    var path = key.split('.');

    key = path.pop();

    for (i = 0, ii = path.length; i < ii; i++) {
        var arrayMatch = path[i].match(arrayMatchRegex);
        if (arrayMatch && arrayMatch.length > 2) {
            var propertyName = arrayMatch[1];
            var arrayIndex = parseInt(arrayMatch[2]);

            if (!tgt[propertyName]) {
                Vue.set(tgt, propertyName, []);
            }
            if (!tgt[propertyName][arrayIndex]) {
                Vue.set(tgt[propertyName], arrayIndex, {});
            }
            tgt = tgt[propertyName][arrayIndex];
        } else {
            if (!tgt[path[i]]) {
                Vue.set(tgt, path[i], {});
            }
            tgt = tgt[path[i]];
        }
    }

    var keyArrayMatch = key.match(arrayMatchRegex);

    if (keyArrayMatch && keyArrayMatch.length > 2) {
        var propertyName = keyArrayMatch[1];
        var arrayIndex = parseInt(keyArrayMatch[2]);

        if (!tgt[propertyName]) {
            Vue.set(tgt, propertyName, []);
        }

        Vue.set(tgt[propertyName], arrayIndex, val);
    } else {
        if (_isObj(tgt[key]) && _isObj(val)) {
            _merge(tgt[key], val);

            return;
        }

        Vue.set(tgt, key, val);
    }
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

    var path = key.split('.');

    for (i = 0, ii = path.length; i < ii; i++) {
        var arrayMatch = path[i].match(arrayMatchRegex);
        if (arrayMatch && arrayMatch.length > 2) {
            var propertyName = arrayMatch[1];
            var arrayIndex = parseInt(arrayMatch[2]);

            if (!tgt[propertyName]) {
               return tgt[propertyName];
            }
            if (!tgt[propertyName][arrayIndex]) {
                return tgt[propertyName][arrayIndex];
            }
            tgt = tgt[propertyName][arrayIndex];
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
