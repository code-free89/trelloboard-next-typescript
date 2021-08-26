import { PlusCircleIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ColumnType, TaskType } from '../types'
import Task from './Task'

type Props = {
  column: ColumnType;
  tasks: TaskType[];
  index: number;
  addCard: Function;
  searchText: string;
};

const Column: React.FC<Props> = ({
  column,
  tasks,
  index,
  addCard,
  searchText
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [cardTitle, setCardTitle] = useState<string>("");

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="m-2 p-2 w-64 h-content rounded bg-gray-100 space-y-4"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="text-base font-semibold text-gray-600" {...provided.dragHandleProps}>{column.title}</div>
          <Droppable droppableId={column.id} type='task'>
            {(provided, snapshot) => (
              <div
                className={`space-y-2`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.filter(item => item.content.toLowerCase().includes(searchText.toLowerCase())).map((task, index) => {
                  return <Task key={task.id} task={task} index={index} />
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {
            isEditing ? (
              <div className="flex items-center justify-center flex-wrap space-y-3">
                <input type="text" className="p-1 w-full rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => { setCardTitle(e.target.value) }} />
                <div className="w-full flex items-center justify-around">
                  <button className="bg-green-300 w-16 py-1 rounded-md hover:bg-green-400 font-bold text-gray-600 transition-colors duration-300" onClick={() => { addCard(index, cardTitle); setIsEditing(false); }}>Add</button>
                  <button className="bg-gray-300 w-16 py-1 rounded-md hover:bg-gray-400 font-bold text-gray-700 transition-colors duration-300" onClick={() => {setIsEditing(false);}}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="text-base font-semibold text-gray-600 flex items-center justify-center" onClick={() => { setIsEditing(true); setCardTitle(""); }}>
                <PlusCircleIcon className="w-5 h-5 mr-3" />
                Add another card
              </button>
            )
          }
        </div>
      )}
    </Draggable>      
  )
}

export default Column
