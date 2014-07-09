/**
 * Property name for timers storage in the context objects.
 * @type {string}
 */
var _TIMERS_PROP = '__sw_timers',
    _stopCallback = null;

/**
 * @param {Number[]} hrtime result of process.hrtime()
 * @returns {Number} same time floored to milliseconds
 * @private
 */
function _hrtime2ms(hrtime) {
    return hrtime[0] * 1e3 + Math.round(hrtime[1] / 1e6);
}

/**
 * @param {Object} ctx Context object.
 * @param {String} id Timer ID.
 * @returns {{id: String, time: Number}|null} id and time in milliseconds or
 *      null if timer assigned which associated with `id` isn't exists.
 * @public
 */
function stop(ctx, id, preventCallback) {
    var result,
        timers = ctx[_TIMERS_PROP];

    if (typeof timers === 'object' && timers !== null &&
        Object.prototype.hasOwnProperty.call(timers, id) && timers[id] !== null) {
        result = _hrtime2ms(process.hrtime(timers[id]));

        timers[id] = null;

        if (preventCallback !== true && typeof _stopCallback === 'function') {
            setImmediate(function() {
                _stopCallback(id, result);
            });
        }

        return {
            id: id,
            time: result
        };
    } else {
        return null;
    }
}

/**
 * @param {Object} ctx Context object
 * @param {String} id Timer id, which must be unique in the context.
 * @returns {Function} function, which can be used to stop the timer without required arguments to pass.
 * @public
 */
function start(ctx, id) {
    if (typeof ctx[_TIMERS_PROP] === 'undefined') {
        // hidden prop to store timers in the context
        Object.defineProperty(ctx, _TIMERS_PROP, {
            value: {},
            configurable: true,
            writable: true,
            enumerable: false
        });
    }

    var stopFn = function(preventCallback) {
            return stop(ctx, id, preventCallback);
        };

    ctx[_TIMERS_PROP][id] = process.hrtime();

    return stopFn;
}

module.exports = {
    start: start,
    stop: stop,
    hook: function(callback) {
        _stopCallback = callback;

        return this;
    }
};
