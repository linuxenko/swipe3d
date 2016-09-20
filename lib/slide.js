'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tools = require('./tools');

var _constants = require('./constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slide = function () {
  function Slide() {
    var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Slide);

    if (!element) {
      throw new Error('Invalid arguments, at least DOM element have to be passed');
    }
    this.element = element;
    this.threshold = options.threshold || 150;
    this.callback = options.callback || function () {};
    this.direction = options.direction || _constants.DIR.BOTTOM;
    this.slideOffset = options.slideOffset || 0;
    this.shrink = options.shrink || 0;

    this.reinit();

    this.distX = 0;
    this.distY = 0;

    this.parent = (0, _tools.grp)(this.element);

    if (_constants.DIR.isVertical(this.direction)) {
      if (isNaN(parseInt(this.element.style.top)) || parseInt(this.element.style.top) === 0) {
        this.element.style.top = this.element.offsetTop + 'px';
      }
      this.elementInitial = parseInt(this.element.style.top);
    } else {
      if (isNaN(parseInt(this.element.style.left)) || parseInt(this.element.style.left) === 0) {
        this.element.style.left = this.element.offsetLeft + 'px';
      }
      this.elementInitial = parseInt(this.element.style.left);
    }

    this.touchStartFn = this.touchStart.bind(this);
    this.touchMoveFn = this.touchMove.bind(this);
    this.touchEndFn = this.touchEnd.bind(this);

    (0, _tools.ael)(window, 'mousedown', this.touchStartFn);
    (0, _tools.ael)(window, 'mousemove', this.touchMoveFn);
    (0, _tools.ael)(window, 'mouseup', this.touchEndFn);
    //ael(this.element, 'mouseout', this.touchEndFn)
    (0, _tools.ael)(window, 'touchstart', this.touchStartFn);
    (0, _tools.ael)(window, 'touchmove', this.touchMoveFn);
    (0, _tools.ael)(window, 'touchend', this.touchEndFn);
  }

  _createClass(Slide, [{
    key: 'destroy',
    value: function destroy() {
      this.reinit();

      (0, _tools.rel)(window, 'mousedown', this.touchStartFn);
      (0, _tools.rel)(window, 'mousemove', this.touchMoveFn);
      (0, _tools.rel)(window, 'mouseup', this.touchEndFn);
      //rel(this.element, 'mouseout', this.touchEndFn)
      (0, _tools.rel)(window, 'touchstart', this.touchStartFn);
      (0, _tools.rel)(window, 'touchmove', this.touchMoveFn);
      (0, _tools.rel)(window, 'touchend', this.touchEndFn);
    }
  }, {
    key: 'reinit',
    value: function reinit() {
      this.start = false;
      this.starPos = 0;
    }
  }, {
    key: 'touchStart',
    value: function touchStart(e) {
      if (e.srcElement === this.element) {
        this.start = true;

        if (_constants.DIR.isVertical(this.direction)) {
          this.startPos = e.pageY;
          this.initial = parseInt(this.element.style.top);
        } else {
          this.startPos = e.pageX;
          this.initial = parseInt(this.element.style.left);
        }
      }
      e.preventDefault();
    }
  }, {
    key: 'touchMove',
    value: function touchMove(e) {
      if (this.start === true) {
        this.moveElement(e);
      }

      e.preventDefault();
    }
  }, {
    key: 'touchEnd',
    value: function touchEnd(e) {
      if (this.start === true) {
        this.moveElement(e, true);
        this.reinit();
      }
    }
  }, {
    key: 'elementTo',
    value: function elementTo(offset) {
      if (_constants.DIR.isVertical(this.direction)) {
        this.element.style.top = offset + 'px';
      } else {
        this.element.style.left = offset + 'px';
      }
    }
  }, {
    key: 'handleVertical',
    value: function handleVertical(e) {
      var isEnd = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var cur = _constants.DIR.isVertical(this.direction) ? e.pageY : e.pageX;
      var til = cur - this.startPos;
      var offset = this.initial + til;
      var skipmove = false;

      if (offset < this.elementInitial && (this.direction === _constants.DIR.BOTTOM || this.direction === _constants.DIR.LEFT) || offset > this.elementInitial && (this.direction === _constants.DIR.TOP || this.direction === _constants.DIR.RIGHT)) {
        offset = this.elementInitial;
        skipmove = true;
      }

      if (offset > this.shrink && (this.direction === _constants.DIR.BOTTOM || this.direction === _constants.DIR.LEFT) || offset < this.shrink && (this.direction === _constants.DIR.TOP || this.direction === _constants.DIR.RIGHT)) {
        offset = this.shrink;
        skipmove = true;
      }

      if ((Math.abs(til) >= this.threshold || isEnd === true) && skipmove === false) {
        if ((cur < this.startPos && (this.direction === _constants.DIR.BOTTOM || this.direction === _constants.DIR.LEFT) || cur > this.startPos && (this.direction === _constants.DIR.TOP || this.direction === _constants.DIR.RIGHT)) && isEnd === true) {
          if (Math.abs(til) >= this.threshold) {
            this.elementTo(this.elementInitial);
          } else {
            this.elementTo(this.shrink);
          }
        } else if (isEnd === true) {
          if (Math.abs(til) <= this.threshold) {
            this.elementTo(this.elementInitial);
          } else {
            this.elementTo(this.shrink);
          }
        } else {
          this.elementTo(offset);
        }
      } else {
        this.elementTo(offset);
      }
    }
  }, {
    key: 'moveElement',
    value: function moveElement(e) {
      var isEnd = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (_constants.DIR.isVertical(this.direction) === true) {
        this.handleVertical(e, isEnd);
      } else {
        this.handleVertical(e, isEnd);
      }
    }
  }]);

  return Slide;
}();

exports.default = Slide;