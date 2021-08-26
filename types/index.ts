export type TaskType = {
  id: string;
  content: string;
}

export type CategoryType = {
  tasks: {
    [key in string]: TaskType;
  },
  columns: {
    [key in string]: ColumnType;
  },
  // Facilitate reordering of the columns
  columnOrder: string[],
}

export type ColumnType = {
  id: string,
  title: string,
  taskIds: string[],
}