/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/Exception', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * Default Exception
     * Create custom exception with message
     *
     * @param {string} message
     */
    var Exception = function (message) {
        Error.call(this);
        this.message = message;

        /**
         * Convert exception to String
         * @returns {string|}
         */
        this.toString = function () {
            return this.message;
        }
    };

    Exception.prototype = Object.create(Error.prototype);
    Exception.prototype.constructor = Exception;

    if (global.exports !== undefined)  global.exports.Exception = Exception;
    if (typeof define !== 'function' || !define.amd) global.Exception = Exception;
    return Exception;
}));