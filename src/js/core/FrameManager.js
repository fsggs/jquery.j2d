/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/FrameManager', ['utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'));
    } else {
        factory(root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap) {
    "use strict";

    var instance;
    var engineStack = new ArrayMap(), dataStack = new ArrayMap();

    var options = {
        frameLimit: 60,
        frameRun: false,
        breakAnimationFrame: false
    };

    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                if (!options.breakAnimationFrame) {
                    window.setTimeout(callback.call(callback, [
                        Date.now() //TODO:: fix this
                    ]), 1000.0 / options.frameLimit);
                } else {
                    options.breakAnimationFrame = false
                }
            };
    })();

    var cancelAnimationFrame = (function () {
        options.breakAnimationFrame = true;

        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame;
    })();


    var FrameManager = function () {
    };

    FrameManager.prototype.start = function (name, engine, params) {
        var data = {
            j2d: undefined,
            frameLimit: options.frameLimit,
            now: 0,
            deltaTime: 0,
            lastTime: 0,
            sceneStartTime: 0,
            sceneSkipTime: 0
        };

        if (params.frameLimit !== undefined && params.frameLimit <= options.frameLimit) data.frameLimit = params.frameLimit;

        if (params.j2d !== undefined) {
            data.j2d = params.j2d;
        } else {
            throw 'j2d not transported to FrameManager.start(id, engine, {... j2d: j2d ...});';
        }

        data.interval = 1000.0 / data.frameLimit;
        data.lastTime = Date.now();

        engineStack.add(name, engine);
        dataStack.add(name, data);
        if (!options.frameRun) this.pulse();
    };

    FrameManager.prototype.stop = function (name) {
        engineStack.remove(name);
        dataStack.remove(name);
    };

    FrameManager.prototype.pulse = function () {
        this.runMainLoop(Date.now());
    };

    FrameManager.prototype.runMainLoop = function (timestamp, frameManager) {
        if (frameManager === undefined) frameManager = this;

        if (engineStack.length <= 0 && options.frameRun) {
            options.frameRun = false;
            return cancelAnimationFrame(this.runMainLoop);
        }
        options.frameRun = true;

        for (var index in engineStack) {
            if (engineStack.hasOwnProperty(index) && 'function' === typeof engineStack[index]) {
                var engine = engineStack[index];
                var data = dataStack[index];

                data.now = Date.now();
                data.j2d.data.deltaTime = data.deltaTime = (data.now - data.lastTime) / 100.0;

                if (data.j2d.data.io && !data.j2d.data.pause) data.j2d.data.io.update();
                if ((data.deltaTime * 100.0) > data.interval) {
                    data.lastTime = data.now - ((data.deltaTime * 100.0) % data.interval);

                    if (!data.j2d.data.pause) {
                        data.j2d.data.deltaTime = data.deltaTime;

                        engine(timestamp, data);

                    }
                }
                if (data.j2d.data.io && !data.j2d.data.pause) data.j2d.data.io.clear();
            }
        }

        requestAnimationFrame(function (timestamp) {
            frameManager.runMainLoop(timestamp, frameManager);
        });
    };

    FrameManager.prototype.setDefaultFrameLimit = function (frameLimit) {
        if (frameLimit <= 60 && frameLimit > 0) {
            options.frameLimit = frameLimit
        }
    };

    /* Singleton */
    FrameManager.Init = function () {
        if (window.J2D !== undefined) {
            return window.instanceFrameManager || (window.instanceFrameManager = new FrameManager());
        } else {
            return instance || (instance = new FrameManager());
        }
    };

    if (window.J2D === undefined) window.FrameManager = FrameManager.Init();

    return FrameManager.Init();
}));
