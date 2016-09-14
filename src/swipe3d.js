import {ael, grc} from './tools'
import {DIR} from './constants'
/*
 *  @element
 *    DOM element
 *  @options
 *    threshold - int (default 120)
 *    swipeTime - int (default 300)
 *
 */


export default class Swipe3d {
  constructor(element = null, options= {}) {
    if (!element) { throw new Error('Invalid arguments, at least DOM element have to be passed') }
    this.element = element
    this.threshold = options.threshold || 80
    this.swipeTime = options.swipeTime || 100
    this.restraint = options.restraint || 100
    this.callback  = options.callback  || function() {}

    this.reinit()

    const touchStart = this.touchStart.bind(this)
    const touchMove = this.touchMove.bind(this)
    const touchEnd = this.touchEnd.bind(this)

    ael(this.element, 'mousedown', touchStart)
    ael(this.element, 'mousemove', touchMove)
    ael(this.element, 'mouseup', touchEnd)
    ael(this.element, 'mouseout', touchEnd)
    ael(this.element, 'touchstart', touchStart)
    ael(this.element, 'touchmove', touchMove)
    ael(this.element, 'touchend', touchEnd)
  }

  reinit() {
    this.startTime = 0
    this.startX = 0
    this.startY = 0
    this.distX = 0
    this.distY = 0
    this.direction = DIR.NONE
  }

  touchStart(e) {
    let pos = grc(e)

    this.reinit()

    this.startX = pos.x
    this.startY = pos.y
    this.startTime = new Date().getTime()

    e.preventDefault()
  }

  touchMove(e) {
    let time = this.startTime !== 0 ? new Date().getTime() - this.startTime : 0
    let pos = grc(e)

    if (this.direction === DIR.NONE && time >= this.swipeTime) {
      this.distX = pos.x - this.startX
      this.distY = pos.y - this.startY

      if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
        this.direction = this.distX < 0 ? DIR.LEFT : DIR.RIGHT
      }
      else
      if (Math.abs(this.distY) >= this.threshold && Math.abs(this.distX) <= this.restraint) {
        this.direction = this.distY < 0 ? DIR.TOP : DIR.BOTTOM
      }
    } else if (this.direction !== DIR.NONE){
      if (this.direction === DIR.LEFT || this.direction === DIR.RIGHT) {
        this.callback(e, this.direction, pos)
      } else {
        this.callback(e, this.direction, pos)
      }
      this.reinit()
    }
    e.preventDefault()
  }

  touchEnd() {
    this.reinit()
  }
}
