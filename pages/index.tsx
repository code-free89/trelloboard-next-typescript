import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { DragDropContext, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { CategoryType, ColumnType } from '../types';
import initialData from '../constants/mockdata';
import Column from '../components/Column';
import { PlusCircleIcon } from '@heroicons/react/solid'

export default function Home() {

  const [columns, setColumns] = useState<CategoryType>(initialData);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [searchTitle, setSearchTitle] = useState<string>("");

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

  const addBoard = () => {
    if (columnTitle == "") return;
    const columnCount = columns.columnOrder.length + 1;
    const newColumnID = `column-${columnCount}`;
    setColumns(prevState => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newColumnID]: {
          id: newColumnID,
          title: columnTitle,
          taskIds: []
        }
      },
      columnOrder: [
        ...prevState.columnOrder,
        newColumnID
      ]
    }));
    setIsEditing(false);
  }

  const addCard = (index: number, cardTitle: string) => {
    if (cardTitle == "") return;
    const columnID = `column-${index + 1}`;
    const taskID = Object.keys(columns.tasks).length + 1;
    setColumns(prevState => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [`task-${taskID}`]: {
          id: `task-${taskID}`,
          content: cardTitle,
        }
      },
      columns: {
        ...prevState.columns,
        [columnID]: {
          ...prevState.columns[columnID],
          taskIds: [
            ...prevState.columns[columnID].taskIds,
            `task-${taskID}`
          ]
        }
      }
    }));
  }

  return (
    <div className="w-screen h-screen bg-blue-400 p-5">
      <div className="flex items-center justify-between px-2 pb-5">
        <div className="text-2xl text-white font-bold">Trello Board</div>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-bold text-white">Search : </div>
          <input type="text" className="p-1 rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => { setSearchTitle(e.target.value) }} />
        </div>
      </div>
      <div className="w-full flex overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd} >
          <Droppable droppableId='all-columns' direction='horizontal' type='column'>
            {(provided) => (
              <div className="flex" {...provided.droppableProps} ref={provided.innerRef}>
                {columns.columnOrder.map((id, index) => {
                  const column = columns.columns[id]
                  const tasks = column.taskIds.map(taskId => columns.tasks[taskId])
                  return mounted ? <Column key={column.id} column={column} tasks={tasks} index={index} addCard={addCard} searchText={searchTitle} /> : <></>;
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="m-2 p-2 w-64 min-w-64 h-content rounded bg-gray-100 space-y-4 flex items-center justify-center">
          {
            isEditing ? (
              <div className="flex items-center justify-center flex-wrap space-y-3">
                <input type="text" className="p-1 w-full rounded-sm border border-gray-300 focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => { setColumnTitle(e.target.value) }} />
                <div className="w-full flex items-center justify-around">
                  <button className="bg-green-300 w-16 py-1 rounded-md hover:bg-green-400 font-bold text-gray-600 transition-colors duration-300" onClick={() => { addBoard();}}>Add</button>
                  <button className="bg-gray-300 w-16 py-1 rounded-md hover:bg-gray-400 font-bold text-gray-700 transition-colors duration-300" onClick={() => {setIsEditing(false);}}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="text-base font-semibold text-gray-600 flex items-center justify-center" onClick={() => { setIsEditing(true); setColumnTitle(""); }}>
                <PlusCircleIcon className="w-5 h-5 mr-3" />
                Add another board
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}
