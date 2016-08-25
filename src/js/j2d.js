/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/*
 * TODO:: Events System
 */

/**
 * @module "j2d"
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d', [
            'core/SceneManager',
            'utils/DeviceUtil',
            'utils/ObjectUtil',
            'utils/UUID',
            'utils/SystemConsole',
            'utils/ArrayMap'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('core/SceneManager'),
            require('utils/DeviceUtil'),
            require('utils/ObjectUtil'),
            require('utils/UUID'),
            require('utils/SystemConsole'),
            require('utils/ArrayMap')
        );
    } else {
        factory(
            root.j2d.core.SceneManager,
            root.j2d.utils.DeviceUtil,
            root.j2d.utils.ObjectUtil,
            root.j2d.utils.UUID,
            root.j2d.utils.SystemConsole,
            root.j2d.utils.ArrayMap
        );
    }
}(typeof window !== 'undefined' ? window : global, function (SceneManager, DeviceUtil, ObjectUtil, UUID, Log, ArrayMap) {
    "use strict";

    /**
     * @class EngineJ2D
     * @exports module:"j2d"
     * @alias module:"j2d"
     *
     * @param {Element} element
     * @param {EngineJ2D.defaults} data
     *
     * @constructor
     * @property {boolean} WebGL // TODO:: To scene
     * @property {boolean} smoothing // TODO:: To scene
     * @property {InputManager|null} io
     * @property {MediaManager|null} media
     * @property {boolean} isPlay
     */
    var EngineJ2D = function (element, data) {
        var j2d = this;

        /** @type {Element} */
        this.element = element;

        /** @type EngineJ2D.defaults */
        this.data = data;

        /** @type DeviceUtil */
        this.device = new DeviceUtil();

        /** @type SceneManager */
        this.scene = new SceneManager(this);

        /** @type SystemConsole */
        this.Log = new Log();

        Object.defineProperty(this, 'WebGL', {
            get: function () {
                return j2d.data.webGL;
            },
            set: function (value) {
                j2d.data.webGL = !!value;
                if (!!value && !j2d.data.webGL) {
                    j2d.element.classList.add('WebGL');
                } else if (!value && j2d.data.webGL) {
                    j2d.element.classList.remove('WebGL');
                }
            }
        });

        Object.defineProperty(this, 'smoothing', {
            get: function () {
                return j2d.data.smoothing;
            },
            set: function (value) {
                j2d.data.smoothing = !!value;
            }
        });

        Object.defineProperty(this, 'io', {
            get: function () {
                return j2d.data.io;
            },
            set: function (value) {
                return j2d.data.io = value
            }
        });

        Object.defineProperty(this, 'media', {
            get: function () {
                return j2d.data.media;
            },
            set: function (value) {
                return j2d.data.media = value
            }
        });

        Object.defineProperty(this, 'isPlay', {
            get: function () {
                return !j2d.data.pause;
            },
            set: function () {
            }
        });
    };

    EngineJ2D.VERSION = '0.2.0-dev';

    EngineJ2D.defaults = {
        /** @type string|null */
        id: null,
        io: null,
        media: null,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        webGL: false
    };

    /** +GameEngine **/
    EngineJ2D.prototype.start = function () {
        this.scene.start();
        this.trigger('start');
    };

    EngineJ2D.prototype.stop = function () {
        this.scene.stop();
        this.trigger('stop');
    };

    // TODO:: add MediaManager
    EngineJ2D.prototype.pause = function () {
        if (this.data.io) this.data.io.flush();
        this.data.pause = true;
        this.element.classList.add('pause');
        this.trigger('pause');
    };

    // TODO:: add MediaManager
    EngineJ2D.prototype.resume = function () {
        this.element.classList.remove('pause');
        this.element.focus();
        this.data.pause = false;
        if (this.data.io) this.data.io.flush();
        this.trigger('resume');
    };
    /** -GameEngine **/

    /** @returns {SceneManager} */
    EngineJ2D.prototype.getSceneManager = function () {
        return this.scene;
    };

    /** @returns {LayersManager} */
    EngineJ2D.prototype.getLayersManager = function () {
        return this.scene.layersManager;
    };

    /** @returns {FrameManager} */
    EngineJ2D.prototype.getFrameManager = function () {
        return this.scene.frameManager;
    };

    /** @returns {ViewportManager} */
    EngineJ2D.prototype.getViewportManager = function () {
        return this.scene.viewportManager;
    };

    /** @returns {GameStatesManager} */
    EngineJ2D.prototype.getGameStatesManager = function () {
        return this.scene.gameStatesManager;
    };

    EngineJ2D.prototype.on = function () {
    };
    EngineJ2D.prototype.once = function () {
    };
    EngineJ2D.prototype.off = function () {
    };
    EngineJ2D.prototype.trigger = function () {
    };

    EngineJ2D.prototype.log = function (message, level) {
        this.Log.log(message, level);
    };

    /** Utils **/
    EngineJ2D.util = {
        /**
         * @param {CanvasRenderingContext2D} context
         */
        disableSmoothing: function (context) {
            var chrome = global.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            var version = chrome ? parseInt(chrome[2], 10) : false;

            context['imageSmoothingEnabled'] = false;
            context['mozImageSmoothingEnabled'] = false;
            context['oImageSmoothingEnabled'] = false;
            if (version && version <= 29) {
                context['webkitImageSmoothingEnabled'] = false;
            }
            context['msImageSmoothingEnabled'] = false;
        }
    };
    EngineJ2D.prototype.util = EngineJ2D.util;

    /**
     * @type {Array.<EngineJ2D>|ArrayMap.<EngineJ2D>}
     */
    EngineJ2D.stack = new ArrayMap();

    /**
     * @name EngineJ2D
     * @static
     *
     * @param {string|jQuery} selected
     * @param {EngineJ2D.defaults|Object} options
     *
     * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
     */
    EngineJ2D.initEngine = function (selected, options) {
        var nodes = [];
        if (typeof selected === 'string') {
            nodes = global.document.querySelectorAll(selected);
        } else if (typeof selected === 'object' && jQuery !== undefined && selected instanceof jQuery) {
            nodes = selected.get();
        } else return null;

        var inactiveNodes = [];
        Array.prototype.forEach.call(nodes, function (node) {
            if (!node.hasAttribute('guid')) inactiveNodes.push(node)
        });

        inactiveNodes.forEach(function (element) {
            var options = ObjectUtil.extend(true, {}, EngineJ2D.defaults, options);
            options.id = UUID.generate();

            element.setAttribute('guid', options.id);

            var id = element.getAttribute('id');
            if (id === undefined || id === null) {
                element.setAttribute('guid', options.id);
            }

            var tabIndex = element.getAttribute('tabindex');
            if (tabIndex === undefined || tabIndex === null || tabIndex === false) {
                element.setAttribute('tabindex', '-1');
            }

            if (!element.classList.contains('j2d')) {
                element.classList.add('j2d');
            }

            EngineJ2D.stack.add(options.id, new EngineJ2D(element, options));
            element.click();
            element.focus();
        });

        var resumeBind = function (current) {
            var nodes, engine;
            nodes = global.document.querySelectorAll('div.canvas[guid]:not(.pause-disable):not(:focus)');
            Array.prototype.forEach.call(nodes, function (node) {
                if (current !== node) {
                    node.classList.remove('active');
                    engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                    if (engine) engine.pause();
                }
            });

            nodes = global.document.querySelectorAll('div.canvas[guid].active.pause-disable:not(:focus)');
            Array.prototype.forEach.call(nodes, function (node) {
                if (current !== node) {
                    node.classList.remove('active');
                }
            });
        };

        function resumeEventListener() {
            var engine;
            if (this.classList.contains('pause')) {
                engine = EngineJ2D.stack.get(this.getAttribute('guid'));
                if (engine) engine.resume();
                resumeBind(this);
            } else if (!this.classList.contains('resume-by-click') && this.classList.contains(':focus')) {
                this.classList.add('active');
                this.focus();
                engine = EngineJ2D.stack.get(this.getAttribute('guid'));
                if (engine) engine.resume();
                resumeBind(this);
            }
            return true;
        }

        var activeNodes = [];
        nodes = global.document.querySelectorAll('.j2d[guid]');
        Array.prototype.forEach.call(nodes, function (node) {
            activeNodes.push(EngineJ2D.stack.get(node.getAttribute('guid')));
            node.addEventListener('click', resumeEventListener);
            node.addEventListener('touch', resumeEventListener);
            node.addEventListener('mouseenter', resumeEventListener);
        });
        return (1 === activeNodes.length) ? activeNodes[0] : activeNodes;
    };
    EngineJ2D.prototype.initEngine = EngineJ2D.initEngine;

    /* ------------------------------ Plugin ------------------------------ */

    (EngineJ2D.initPlugin = function () {
        if (global.j2dPlugin !== undefined) return null;
        global.j2dPlugin = {pluginInit: true, stack: new ArrayMap()};

        (new Log()).logSystem('j2D v.' + EngineJ2D.VERSION, 'https://github.com/fsggs/j2d');

        if (jQuery !== undefined) {
            /**
             * @param {EngineJ2D.defaults} [options]
             * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
             */
            jQuery.fn.j2d = function (options) {
                return EngineJ2D.initEngine(this, options);
            };
        }

        global.j2dPlugin.initEngine = EngineJ2D.initEngine;

        var firefox = global.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
        var version = firefox ? parseInt(firefox[2], 10) : false;

        var isFullScreen = function () {
            //noinspection JSUnresolvedVariable
            return !!(global.document.webkitFullscreenElement
                || global.document.webkitCurrentFullScreenElement
                || (version && version < 47) ? global.document.mozFullScreenElement : global.document.fullscreenElement
                || global.document.msFullscreenElement
            );
        };

        function fullScreenEventListener() {
            var fullScreen = isFullScreen();
            if (!fullScreen) {
                var node, engine;
                node = global.document.querySelector('.j2d[guid].active');
                if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                if (engine) engine.scene.resizeToFullPage(fullScreen);

                node = global.document.querySelector('.j2d[guid]:not(.active)');
                if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                if (engine) engine.toggle(!fullScreen);
            }
        }

        var html = global.document.querySelector('html');

        if (!html.classList.contains('j2d')) {
            global.document.addEventListener('fullscreenchange', fullScreenEventListener);
            global.document.addEventListener('webkitfullscreenchange', fullScreenEventListener);
            global.document.addEventListener('mozfullscreenchange', fullScreenEventListener);
            global.document.addEventListener('MSFullscreenChange', fullScreenEventListener);

            global.addEventListener('focus', function () {
                var node, engine;
                node = global.document.querySelector('.j2d[guid].active:not(.resume-by-click)');
                if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                if (engine) engine.resume();
            });

            global.addEventListener('blur', function () {
                var nodes, engine;
                nodes = global.document.querySelectorAll('.j2d[guid]:not(.pause-disable)');
                Array.prototype.forEach.call(nodes, function (node) {
                    if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                    if (engine) engine.pause();
                });
            });

            global.addEventListener('resize', function () {
                EngineJ2D.stack.forEach(function (guid) {
                    EngineJ2D.stack[guid].device.onResize();
                });

                var fullScreen = isFullScreen();
                if (fullScreen) {
                    var node, engine;
                    node = global.document.querySelector('.j2d[guid].active');
                    if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                    if (engine) engine.scene.resizeToFullPage(fullScreen);
                }
                return true;
            });
            html.classList.add('j2d');
        }
    })();

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.EngineJ2D = EngineJ2D;
    if (global.j2d !== undefined) global.j2d.EngineJ2D = EngineJ2D;
    return EngineJ2D;
}));
