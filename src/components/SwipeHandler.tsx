import React, { FunctionComponent, useEffect } from 'react'

export enum SwipeDirection {
  LEFT,
  RIGHT
}

type Props = {
  callback: (direction: SwipeDirection) => void
}

const SwipeHandler: FunctionComponent<Props> = ({ callback }) => {
  useEffect(() => {
    let xOffset = 0, yOffset = 0, xPos = 0, yPos = 0
    // Will ignore swipes that covered less than 50% of the screen horizontally.
    const minimumXOffset =
      Math.floor((document.documentElement.clientWidth / 100) * 50)
    // Will ignore swipes that covered more than 25% of the screen vertically.
    const maximumYOffset =
      Math.floor((document.documentElement.clientHeight / 100) * 25) // 25%
    function onTouchStart(e: TouchEvent) {
      xOffset = 0; yOffset = 0

      if (e.touches.length > 1) {
        return undefined
      }

      const { clientX, clientY } = e.changedTouches[0]
      xPos = clientX
      yPos = clientY
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 1) {
        xOffset = 0; yOffset = 0; xPos = 0; yPos = 0
        return undefined
      }

      const { clientX, clientY } = e.changedTouches[0]

      if (clientX !== xPos) {
        xOffset += clientX - xPos
        xPos = clientX
      }

      if (clientY !== yPos) {
        yOffset += clientY - yPos
        yPos = clientY
      }
    }
    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length > 1) {
        xOffset = 0; yOffset = 0; xPos = 0; yPos = 0
        return undefined
      }

      if (Math.abs(yOffset) > maximumYOffset) {
        xOffset = 0; yOffset = 0; xPos = 0; yPos = 0
        return undefined
      }

      if (Math.abs(xOffset) < minimumXOffset) {
        xOffset = 0; yOffset = 0; xPos = 0; yPos = 0
        return undefined
      }

      let direction = xOffset > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT
      xOffset = 0; yOffset = 0; xPos = 0; yPos = 0

      return callback(direction)
    }
    const element = document.documentElement
    element.addEventListener('touchstart', onTouchStart)
    element.addEventListener('touchmove', onTouchMove)
    element.addEventListener('touchend', onTouchEnd)

    return function cleanup() {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [callback])

  return <></>
}

export default SwipeHandler
