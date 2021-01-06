import { COLUMNS } from "../types";

function dragEndHandler(
  result: any,
  columns: COLUMNS,
  setColumns: (columns: COLUMNS) => any,
  columnOrder: Array<string>,
  setColumnOrder: (columnOrder: Array<string>) => any
) {
  const { destination, source, draggableId, type } = result;

  if (!destination) {
    return;
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  // Drag&Drop for columns
  if (type === "column") {
    const newColumnOrder = Array.from(columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);

    setColumnOrder(newColumnOrder);
    return;
  }

  // Card within the same column
  const start = columns[source.droppableId];

  if (source.droppableId === destination.droppableId) {
    const newCardIds = Array.from(start.cardIds);
    newCardIds.splice(source.index, 1);
    newCardIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...start,
      cardIds: newCardIds,
    };

    // Update board state (useState)
    setColumns({ ...columns, [newColumn.id]: newColumn });
    return;
  }

  // Card between two lists
  const finish = columns[destination.droppableId];

  const startCardIds = Array.from(start.cardIds);
  startCardIds.splice(source.index, 1);

  const newStart = {
    ...start,
    cardIds: startCardIds,
  };

  const finishCardIds = Array.from(finish.cardIds);
  finishCardIds.splice(destination.index, 0, draggableId);

  const newFinish = {
    ...finish,
    cardIds: finishCardIds,
  };

  // Update board state (useState)
  setColumns({
    ...columns,
    [newStart.id]: newStart,
    [newFinish.id]: newFinish,
  });

  // Update board in localStorage (done via useEffect)

  return;
}

export default dragEndHandler;