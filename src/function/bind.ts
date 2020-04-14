import slice from '../array/slice';

/**
 * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
 * @param {Function} fn  Function.
 * @param {object} context   Execution context.
 * @param {rest} args    Arguments (0...n arguments).
 * @return {Function} Wrapped Function.
 */
function bind(fn, context, args) {
    const argsArr = slice(arguments, 2); // curried args
    return function() {
        return fn.apply(context, argsArr.concat(slice(arguments)));
    };
}

export default bind;