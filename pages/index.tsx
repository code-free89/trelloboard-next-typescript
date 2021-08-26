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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.columns[source.droppableId];
    const finish = columns.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newColumns = {
        ...columns,
        columns: {
          ...columns.columns,
          [newColumn.id]: newColumn,
        },
      };

      setColumns(newColumns);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newColumns = {
      ...columns,
      columns: {
        ...columns.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setColumns(newColumns);
  };

  return (
    <div className="w-screen h-screen bg-blue-400">
      <DragDropContext onDragEnd={onDragEnd} >
        <div className="flex">
          {
            columns.columnOrder.map((columnID: string) => {
              const column: ColumnType = columns.columns[columnID];
              const tasks = column.taskIds.map((taskId: string) => columns.tasks[taskId]);
              return mounted ? <Column key={column.id} column={column} tasks={tasks} /> : <></>;
            })
          }
        </div>
      </DragDropContext>
    </div>
  )
}
