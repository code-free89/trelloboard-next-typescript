import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { DragDropContext, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { CategoryType, ColumnType } from '../types';
import initialData from '../constants/mockdata';
import Column from '../components/Column';

export default function Home() {

  const [columns, setColumns] = useState<CategoryType>(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    //If there is no destination
    if (!destination) { return }

    //If source and destination is the same
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }

    //If you're dragging columns
    if (type === 'column')
    {
      const newColumnOrder = Array.from(columns.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...columns,
        columnOrder: newColumnOrder
      }
      setColumns(newState)
      return;
    }

    //Anything below this happens if you're dragging tasks
    const start = columns.columns[source.droppableId];
    const finish = columns.columns[destination.droppableId];

    //If dropped inside the same column
    if (start === finish)
    {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }
      const newState = {
        ...columns,
        columns: {
          ...columns.columns,
          [newColumn.id]: newColumn
        }
      }
      setColumns(newState)
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...columns,
      columns: {
        ...columns.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    setColumns(newState)
  };

  return (
    <div className="w-screen h-screen bg-blue-400 p-5">
      <div className="flex items-center justify-between px-2 pb-5">
        <div className="text-2xl text-white font-bold">Trello Board</div>
      </div>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <div className="flex" {...provided.droppableProps} ref={provided.innerRef}>
              {columns.columnOrder.map((id, index) => {
                const column = columns.columns[id]
                const tasks = column.taskIds.map(taskId => columns.tasks[taskId])
                return mounted ? <Column key={column.id} column={column} tasks={tasks} index={index} /> : <></>;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
