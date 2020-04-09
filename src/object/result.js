import isFunction from '../lang/isFunction';

function result(obj, prop) {
    var property = obj[prop];

    if (property === undefined) {
        return;
    }

    return isFunction(property) ? property.call(obj) : property;
}

export default result;
