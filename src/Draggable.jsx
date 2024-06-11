// Draggable.js
import { useDraggable } from "@dnd-kit/core";

import PropTypes from "prop-types";
import { CSS } from "@dnd-kit/utilities";

//prop validation 
Draggable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
// Draggable.js

export function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || undefined,
    touchAction: "none", // Ensure touch devices work correctly
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
