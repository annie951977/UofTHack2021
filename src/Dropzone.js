import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Dropzone = ({ isDropDisabled, trash, id }) => (
  <div className="column col-3">
    <div className="divider" data-content={id.toUpperCase()} />
    <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
      {provided => {
        return (
          <div className="menu trash-list" {...provided.droppableProps} ref={provided.innerRef}>
            {trash.map(({ name }, index) => (
              <Trash key={name} name={name} index={index} />
            ))}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  </div>
);

const Trash = ({ name, index }) => (
  <Draggable key={name} draggableId={name} index={index}>
    {provided => {
      return (
        <div
          className="menu-item tile tile-centered"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <figure style={{ backgroundColor: 'transparent' }} className="avatar tile-icon">
            <img src={process.env.PUBLIC_URL + `/icons/${name.toLowerCase().replace(' ', '-')}.svg`} alt={name} />
          </figure>
          <div className="tile-content">{name}</div>
        </div>
      );
    }}
  </Draggable>
);

export default Dropzone;