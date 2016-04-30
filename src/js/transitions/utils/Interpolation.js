/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('transitions/utils/Interpolation', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    var InterpolationEnum;

    /**
     * @class Interpolation
     * @exports module:transitions/utils/Interpolation
     * 
     * @type {{Linear: Interpolation.Linear, Bezier: Interpolation.Bezier, CatmullRom: Interpolation.CatmullRom}}
     */
    var Interpolation = {
        /**
         * @return {number}
         */
        Linear: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Interpolation.Utils.Linear;

            if (k < 0) return fn(v[0], v[1], f);
            if (k > 1) return fn(v[m], v[m - 1], m - f);

            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
        },

        /**
         * @return {number}
         */
        Bezier: function (v, k) {
            var b = 0;
            var n = v.length - 1;
            var pw = Math.pow;
            var bn = Interpolation.Utils.Bernstein;

            for (var i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }

            return b;
        },

        /**
         * @return {number}
         */
        CatmullRom: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Interpolation.Utils.CatmullRom;

            if (v[0] === v[m]) {
                if (k < 0) i = Math.floor(f = m * (1 + k));

                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            } else {
                if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

                return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        }
    };

    Interpolation.Utils = {
        /**
         * @return {number}
         */
        Linear: function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        },

        /**
         * @return {number}
         */
        Bernstein: function (n, i) {
            var fc = Interpolation.Utils.Factorial;
            return fc(n) / fc(i) / fc(n - i);
        },

        Factorial: (function () {
            var a = [1];
            return function (n) {
                var s = 1;
                if (a[n]) return a[n];

                for (var i = n; i > 1; i--) {
                    s *= i;
                }
                a[n] = s;

                return s;
            };
        })(),

        /**
         * @return {number}
         */
        CatmullRom: function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    };

    Interpolation.get = function (interpolation) {
        if (InterpolationEnum[interpolation] !== undefined) {
            return InterpolationEnum[interpolation];
        }

        // TODO:: Exceptions
        //throw new InvalidArgumentException('Unknown interpolation: ' + interpolation);
    };

    Interpolation.register = function (interpolation, interpolationFunction) {
        InterpolationEnum[interpolation] = interpolationFunction;
    };

    InterpolationEnum = {
        'linear': Interpolation.Linear,
        'bezier': Interpolation.Bezier,
        'catmull-rom': Interpolation.CatmullRom
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Interpolation = Interpolation;
    if (global.j2d === undefined) global.j2d.transitions.utils.Interpolation = Interpolation;
    return Interpolation;
}));