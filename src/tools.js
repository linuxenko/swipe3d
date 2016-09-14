function ael(e, n, h){
    if( e.addEventListener ){
        e.addEventListener(n, h, true)
    }else{
        e.attachEvent('on'+n, h)
    }
}

function grc(e) {
  let pos = {}, offset = {}, ref = e.target

  pos.x = !! e.touches ? e.touches[ 0 ].pageX : e.pageX
  pos.y = !! e.touches ? e.touches[ 0 ].pageY : e.pageY

  offset.left = ref.offsetLeft
  offset.top = ref.offsetTop

  while(ref) {
      offset.left += ref.offsetLeft
      offset.top += ref.offsetTop
      ref = ref.offsetParent
  }
  return {
      x : pos.x - offset.left,
      y : pos.y - offset.top
  };
}

export { ael, grc }
