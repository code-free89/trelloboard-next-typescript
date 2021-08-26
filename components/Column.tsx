import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ColumnType, TaskType } from '../types'
import Task from './Task'

type Props = {
  column: ColumnType,
  tasks: TaskType[],
  index: number
}

const Column: React.FC<Props> = ({
  column,
  tasks,
  index
}) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="m-2 p-2 w-64 h-full rounded bg-gray-100 space-y-4"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="text-base font-semibold text-gray-600" {...provided.dragHandleProps}>{column.title}</div>
          <Droppable droppableId={column.id} type='task'>
            {(provided, snapshot) => (
              <div
                className={`h-full space-y-2`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => {
                  return <Task key={task.id} task={task} index={index} />
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>      
  )
}

export default Column
