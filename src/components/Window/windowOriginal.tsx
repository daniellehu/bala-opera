import { useState, MouseEventHandler } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'

import styles from './window.module.scss'
import Header from '../Header/header'
import { Dimension, Position } from '../../common/types/animation'
import DragMove from './DragMove'

type DraggableData = {
  node: HTMLElement,
  x: number, y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number
}

const positionToStyle = (position: Position) => ({ left: position.x, top: position.y })

export default function Window({
  title,
  dimension,
  source,
  destination,
  isOpen,
  isFullscreen = false,
  animationDuration = 400,
  isFade = false,
  isScrollable = false,
  clickHandler,
  children,
}: {
  title: string,
  isOpen: boolean,
  dimension?: Dimension,
  source?: Position,
  destination?: Position,
  isFullscreen?: boolean,
  animationDuration?: number,
  isFade?: boolean,
  isScrollable?: boolean,
  clickHandler: MouseEventHandler,
  children?: React.ReactNode,
}) {
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const canAnimate = source && destination && dimension
  let windowOpenStyle = useSpring({})
  let headerStyle = useSpring({})
  let contentStyle = useSpring({})

  
  
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handleDragMove = (e) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  const applyOpen = useTransition(isOpen, isFade
    ? {
        from: { opacity: 0, },
        enter: { opacity: 1, },
        leave: { opacity: 1, },
        config: { duration: animationDuration },
      }
    : {
        from: { opacity: 0, transform: 'translate3d(0, 150%, 0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0%, 0)' },
        leave: { opacity: 0, transform: 'translate3d(0, 0%, 0)' },
        config: { duration: animationDuration },
      })
  const applyClosed = useTransition(isOpen, isFade
    ? {
        from: { opacity: 1, },
        enter: { opacity: 0, },
        leave: { opacity: 0, },
        config: { duration: animationDuration },
      }
    : {
        from: { opacity: 1, transform: 'translate3d(0, 0%, 0)' },
        enter: { opacity: 0, transform: 'translate3d(0, 150%, 0)' },
        leave: { opacity: 0, transform: 'translate3d(0, 150%, 0)' },
        config: { duration: animationDuration },
      })

  if (canAnimate) {
    windowOpenStyle = useSpring({
      from: {
        width: 0,
        height: 0,
        ...positionToStyle(source),
        translateX: translate.x,
        translateY: translate.y,
      },
      to: {
        ...dimension,
        ...positionToStyle(destination),
      },
      reverse: !isOpen,
      config: { duration: animationDuration },
    })
    headerStyle = useSpring({
      from: { opacity: 0 },
      to: { opacity: 1, cursor: 'move' },
      delay: animationDuration + 300,
      reverse: !isOpen,
    })
    contentStyle = useSpring({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: animationDuration + 400,
      reverse: !isOpen,
    })
  }

  const FullScreen = (style) => (
    <animated.div className={styles.fullscreen} style={{ ...style }}>
      <div className={styles.fullscreen}>
        <Header title={title} minimizeHandler={clickHandler} />
        <div className={`${isOpen && styles.contentPadding} ${isScrollable ? styles.scrollableContent : styles.content}`}>
          {children}
        </div>
      </div>
    </animated.div>
    )

  return isFullscreen || !canAnimate
    ? (isOpen ? applyOpen(FullScreen) : applyClosed(FullScreen))
    : (<DragMove onDragMove={handleDragMove}>
      {/* <div style={{
            transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
          }}> */}
          <animated.div className={styles.window} style={{ ...windowOpenStyle,  transform: `translateX(${translate.x}px) translateY(${translate.y}px)`, }}>
            <animated.div style={headerStyle} id='header'>
              {isOpen && (
                <Header title={title} minimizeHandler={clickHandler} />
              )}
            </animated.div>
            <div className={
              `${isOpen && styles.contentPadding} ${isScrollable ? styles.scrollableContent : styles.content}`}>
              {isOpen && (
                <animated.div style={contentStyle}>
                  {children}
                </animated.div>
              )}
            </div>
          </animated.div>
        {/* </div> */}
      </DragMove>)
}