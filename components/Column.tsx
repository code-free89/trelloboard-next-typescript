import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { ColumnType, TaskType } from '../types'
import Task from './Task'
import styled from 'styled-components';

type Props = {
  column: ColumnType,
  tasks: TaskType[]
}

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props: {isDraggingOver: boolean}) => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

const Column: React.FC<Props> = ({
  column,
  tasks
}) => {
  return (
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div className="m-2 p-2 w-64 h-full rounded bg-gray-100 space-y-4">
            <div className="text-base font-semibold text-gray-600">{column.title}</div>
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
          </div>
        )}
      </Droppable>
  )
}

export default Column
