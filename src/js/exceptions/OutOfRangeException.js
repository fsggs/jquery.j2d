/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/OutOfRangeException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * OutOfRangeException
     * Create custom exception with message
     *
     * @class OutOfRangeException
     * @exports module:exceptions/OutOfRangeException
     *
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var OutOfRangeException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    OutOfRangeException.prototype = Object.create(Exception.prototype);
    OutOfRangeException.prototype.constructor = OutOfRangeException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.OutOfRangeException = OutOfRangeException;
    if (global.j2d === undefined) global.j2d.exceptions.OutOfRangeException = OutOfRangeException;
    return OutOfRangeException;
}));
