/**
 * 这种动画效果叫做 low-poly
 * https://www.bypeople.com/svg-low-poly-background-css-js-snippet/
 */
let refreshTimeout: number
let numPointsX: number
let numPointsY: number
let unitWidth: number
let unitHeight: number
var points: Array<{ x: number, y: number, originX: number, originY: number }> | void

let polygonCache: {
  [key: string]: {
    point1: number,
    point2: number,
    point3: number,
  }
} = {}

const createKey = () => {
  return `${(Math.random() * 10) | 0}${Date.now()}`
}



export function draw(container: Element, refreshDuration: number = 10000) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', container.clientWidth + '')
  svg.setAttribute('height', container.clientHeight + '')
  container.appendChild(svg)

  var unitSize = (container.clientWidth + container.clientHeight) / 20
  numPointsX = Math.ceil(container.clientWidth / unitSize) + 1
  numPointsY = Math.ceil(container.clientHeight / unitSize) + 1
  unitWidth = Math.ceil(container.clientWidth / (numPointsX - 1))
  unitHeight = Math.ceil(container.clientHeight / (numPointsY - 1))

  points = []
  polygonCache = {}

  for (let y = 0; y < numPointsY; y++) {
    for (let x = 0; x < numPointsX; x++) {
      points.push({ x: unitWidth * x, y: unitHeight * y, originX: unitWidth * x, originY: unitHeight * y })
    }
  }

  randomize()

  for (let i = 0; i < points.length; i++) {
    if (points[i].originX !== unitWidth * (numPointsX - 1) && points[i].originY !== unitHeight * (numPointsY - 1)) {
      var topLeftX = points[i].x
      var topLeftY = points[i].y
      var topRightX = points[i + 1].x
      var topRightY = points[i + 1].y
      var bottomLeftX = points[i + numPointsX].x
      var bottomLeftY = points[i + numPointsX].y
      var bottomRightX = points[i + numPointsX + 1].x
      var bottomRightY = points[i + numPointsX + 1].y

      var rando = Math.floor(Math.random() * 2)

      for (let n = 0; n < 2; n++) {
        let polygon = document.createElementNS(svg.namespaceURI, 'polygon') as any
        let key = createKey()
        polygon.setAttribute('key', key)
        if (rando === 0) {
          if (n === 0) {
            polygonCache[key] = {
              point1: i,
              point2: i + numPointsX,
              point3: i + numPointsX + 1
            }
            polygon.point1 = i
            polygon.point2 = i + numPointsX
            polygon.point3 = i + numPointsX + 1
            polygon.setAttribute(
              'points',
              `${topLeftX},${topLeftY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`)

          } else if (n === 1) {
            polygonCache[key] = {
              point1: i,
              point2: i + 1,
              point3: i + numPointsX + 1
            }
            polygon.point1 = i
            polygon.point2 = i + 1
            polygon.point3 = i + numPointsX + 1
            polygon.setAttribute(
              'points',
              `${topLeftX},${topLeftY} ${topRightX},${topRightY} ${bottomRightX},${bottomRightY}`)
          }
        } else if (rando === 1) {
          if (n === 0) {
            polygonCache[key] = {
              point1: i,
              point2: i + numPointsX,
              point3: i + 1
            }
            polygon.point1 = i
            polygon.point2 = i + numPointsX
            polygon.point3 = i + 1
            polygon.setAttribute(
              'points',
              `${topLeftX},${topLeftY} ${bottomLeftX},${bottomLeftY} ${topRightX},${topRightY}`)
          } else if (n === 1) {
            polygonCache[key] = {
              point1: i + numPointsX,
              point2: i + 1,
              point3: i + numPointsX + 1
            }
            polygon.point1 = i + numPointsX
            polygon.point2 = i + 1
            polygon.point3 = i + numPointsX + 1
            polygon.setAttribute(
              'points',
              `${bottomLeftX},${bottomLeftY} ${topRightX},${topRightY} ${bottomRightX},${bottomRightY}`)
          }
        }
        polygon.setAttribute('fill', 'rgba(0,0,0,' + (Math.random() / 3) + ')')
        var animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
        animate.setAttribute('fill', 'freeze')
        animate.setAttribute('attributeName', 'points')
        animate.setAttribute('dur', refreshDuration + 'ms')
        animate.setAttribute('calcMode', 'linear')
        polygon.appendChild(animate)
        svg.appendChild(polygon)
      }
    }
  }

  refresh(container, refreshDuration)

}

function randomize() {
  for (var i = 0; i < points!.length; i++) {
    if (points[i].originX !== 0 && points[i].originX !== unitWidth * (numPointsX - 1)) {
      points[i].x = points[i].originX + Math.random() * unitWidth - unitWidth / 2
    }
    if (points[i].originY !== 0 && points[i].originY !== unitHeight * (numPointsY - 1)) {
      points[i].y = points[i].originY + Math.random() * unitHeight - unitHeight / 2
    }
  }
}

function refresh(container: Element, refreshDuration: number = 10000) {
  randomize()
  for (var i = 0; i < container.querySelector('svg')!.childNodes.length; i++) {
    var polygon = container.querySelector('svg')!.childNodes[i] as any
    var animate = polygon.childNodes[0] as any
    if (animate.getAttribute('to')) {
      animate.setAttribute('from', animate.getAttribute('to') + '')
    }
    // if (!polygon.getAttribute('key')) continue
    // let point = polygonCache[polygon.getAttribute('key')!]
    // animate.setAttribute(
    //   'to',
    //   // tslint:disable-next-line:max-line-length
    //   `${points[point.point1].x},${points[point.point1].y} ${
    // points[point.point2].x},${points[point.point2].y} ${points[point.point3].x},${points[point.point3].y}`);
    const wtf = points[polygon.point1].x + ',' + points[polygon.point1].y
    + ' ' + points[polygon.point2].x + ',' + points[polygon.point2].y + ' ' +
    points[polygon.point3].x + ',' + points[polygon.point3].y
    console.log(animate.setAttribute)
    animate.setAttribute('to', wtf)
    (animate as any).beginElement()
  }
  refreshTimeout = window.setTimeout(
    function () { refresh(container, refreshDuration) },
    refreshDuration)
}

export function resize(container: Element, refreshDuration: number = 10000) {
  let svgElements = container.querySelector('svg')
  if (svgElements) {
    svgElements.remove()
  }
  clearTimeout(refreshTimeout)
  draw(container, refreshDuration)
}