import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";

Droppable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  isBin: PropTypes.bool,
};

export function Droppable({ id, children, height = "auto", width = "auto", isBin = false }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style = {
    backgroundColor: isOver ? (isBin ? "red" : "lightgreen") : (isBin ? "lightgrey" : "white"),
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
    border: isOver && !isBin ? "2px solid black" : "none",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
