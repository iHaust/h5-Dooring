import React, { memo, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import Draggable from 'react-draggable'
import GridLayout from 'react-grid-layout'
import { connect } from 'dva'
import DynamicEngine from 'components/DynamicEngine'
import styles from './index.less'

const SourceBox = memo((props) => {
  const { pointData, scaleNum, canvasId, dispatch } = props
  const [canvasRect, setCanvasRect] = useState([])
  const [{ isOver }, drop] = useDrop({
    accept: [],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem()
    })
  })

  const dragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    const curPointData = pointData.filter(item => item.id === newItem.i)[0]
    dispatch({
      type: 'editorModal/modPointData',
      payload: { ...curPointData, point: newItem }
    })
  }

  const onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
    const curPointData = pointData.filter(item => item.id === newItem.i)[0]
    dispatch({
      type: 'editorModal/modPointData',
      payload: { ...curPointData }
    })
  }

  const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    const curPointData = pointData.filter(item => item.id === newItem.i)[0]
    dispatch({
      type: 'editorModal/modPointData',
      payload: { ...curPointData, point: newItem }
    })
  }

  useEffect(() => {
    let { width, height } = document.getElementById(canvasId).getBoundingClientRect()
    setCanvasRect([width, height])
  }, [canvasId])

  const opacity = isOver ? 0.7 : 1
  const backgroundColor = isOver ? 1 : 0.7

  return (
    <Draggable handle=".js_box">
      <div className={styles.canvasBox}>
        <div style={{transform: `scale(${scaleNum})`, position: 'relative', width: '100%', height: '100%'}}>
          
          <div 
            id={canvasId}
            className={styles.canvas} 
            style={{ 
              opacity, backgroundColor
            }} 
            ref={drop} 
          >
          <div 
            className="js_box" 
            style={{
              width: '12px',
              height: '100%',
              position: 'absolute',
              borderRadius: '0 6px 6px 0',
              backgroundColor: '#2f54eb',
              right: '-12px',
              top: '0',
              color: '#fff',
              cursor: 'move'
            }}
          >  
          </div>
            {
              pointData.length > 0 ?
              <GridLayout 
                className={styles.layout} 
                cols={24} 
                rowHeight={2} 
                width={canvasRect[0]} 
                margin={[0,0]}
                onDragStop={dragStop}
                onDragStart={onDragStart}
                onResizeStop={onResizeStop}
              >
                {
                  pointData.map(value => 
                    <div className={styles.dragItem} key={value.id} data-grid={value.point}>
                      <DynamicEngine {...value.item} />
                    </div>
                  )
                }
              </GridLayout> : null
            }
          </div>
        </div>
      </div>
    </Draggable>
  )
})

export default connect(({ editorModal: { pointData } }) => ({
  pointData
}))(SourceBox)
