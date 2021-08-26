import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { TaskType } from '../types'
import styled from 'styled-components';

type Props = {
  task: TaskType,
  index: number,
}

const Task: React.FC<Props> = ({
  task,
  index
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {
        (provided, snapshot) => (
          <div
            className="rounded bg-white text-gray-500 p-2 shadow-sm"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
          </div>
        )
      }
    </Draggable>
  )
}

export default Task
