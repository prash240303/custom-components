// /* eslint-disable react/prop-types */
// import { useState } from "react";
// import {
//   DndContext,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   rectIntersection,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Droppable } from "./Droppable"; // Ensure this is the correct path to your Droppable file
// import Modal from "./Modal"; // Ensure this is the correct path to your Modal file

import Documentdnd from "./components/DocumentDND"
// import CustomKanban from "./components/Kanban"

// function SortableItem({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition || "transform 0.3s ease", // Smooth transition effect
//     touchAction: "none", // Ensure touch devices work correctly
//     width: "100%",
//     height: "100%",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }

// function App() {
//   const [items, setItems] = useState([
//     { id: "1", tag: "Tag1", heading: "Heading 1", content: "Content 1" },
//     { id: "2", tag: "Tag2", heading: "Heading 2", content: "Content 2" },
//     { id: "3", tag: "Tag3", heading: "Heading 3", content: "Content 3" },
//   ]);
//   const [nextId, setNextId] = useState(4);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentEditItem, setCurrentEditItem] = useState(null);
//   const [editTag, setEditTag] = useState("");
//   const [editHeading, setEditHeading] = useState("");
//   const [editContent, setEditContent] = useState("");

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   function handleDragEnd(event) {
//     const { active, over } = event;

//     console.log("Active item:", active.id); // Debugging log
//     console.log("Over item:", over ? over.id : "none"); // Debugging log

//     if (over && active.id !== over.id) {
//       if (over.id === "delete-bin") {
//         // Remove item if it is dropped in the delete bin
//         setItems((items) => items.filter((item) => item.id !== active.id));
//       } else {
//         // Reorder items
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over.id);
//         const reorderedItems = arrayMove(items, oldIndex, newIndex);

//         // Update state with reordered items
//         setItems(reorderedItems);
//       }
//     }
//   }

//   function generateCard() {
//     const newItem = {
//       id: nextId.toString(),
//       tag: `Tag${nextId}`,
//       heading: `Heading ${nextId}`,
//       content: `Content ${nextId}`,
//     };
//     setItems((items) => [...items, newItem]);
//     setNextId(nextId + 1);
//   }

//   function handleEdit(item) {
//     console.log("Editing item:", item); // Debugging log
//     setCurrentEditItem(item);
//     setEditTag(item.tag);
//     setEditHeading(item.heading);
//     setEditContent(item.content);
//     setIsModalOpen(true);
//   }

//   function handleSave() {
//     console.log("Saving item:", currentEditItem.id); // Debugging log
//     setItems((items) =>
//       items.map((item) =>
//         item.id === currentEditItem.id
//           ? {
//               ...item,
//               tag: editTag,
//               heading: editHeading,
//               content: editContent,
//             }
//           : item
//       )
//     );
//     setIsModalOpen(false);
//   }

//   return (
//     <>
//       <main className="w-full h-full items bg-[] ">
//         <DndContext
//           sensors={sensors}
//           collisionDetection={rectIntersection}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext items={items} strategy={verticalListSortingStrategy}>
//             <div className="flex grow-0 overflow-x-scroll hide-scrollbar scroll-smooth w-[90%] mx-24 mt-12 gap-4 p-4">
//               {items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="min-w-[300px] flex-shrink-0 h-72 rounded-lg overflow-hidden border border-black relative group"
//                 >
//                   <Droppable id={item.id} height="100%">
//                     <SortableItem id={item.id}>
//                       <div className="border flex flex-col items-center w-full h-full p-3">
//                         <p className="font-bold">{item.tag}</p>
//                         <h3 className="font-semibold">{item.heading}</h3>
//                         <p>{item.content}</p>
//                         <button
//                           className="mt-auto border border-black opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={() => handleEdit(item)}
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </SortableItem>
//                   </Droppable>
//                 </div>
//               ))}
//             </div>
//           </SortableContext>
//           <div className="absolute border border-black bottom-5 left-1/2 -translate-x-1/2">
//             <Droppable
//               id="delete-bin"
//               height="100px"
//               width="200px"
//               isBin={true}
//             >
//               <div className="flex items-center w-full h-full p-3 justify-center">
//                 <p>Drop here to delete</p>
//               </div>
//             </Droppable>
//           </div>
//           <div className="absolute border border-black left-1/2 -translate-x-1/2 top-5">
//             <button onClick={generateCard}>Generate New Card</button>
//           </div>
//           <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//             <div className="flex flex-col gap-4">
//               <input
//                 type="text"
//                 value={editTag}
//                 onChange={(e) => setEditTag(e.target.value)}
//                 placeholder="Tag"
//                 className="p-2 border rounded"
//               />
//               <input
//                 type="text"
//                 value={editHeading}
//                 onChange={(e) => setEditHeading(e.target.value)}
//                 placeholder="Heading"
//                 className="p-2 border rounded"
//               />
//               <textarea
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 placeholder="Content"
//                 className="p-2 border rounded"
//               />
//               <button
//                 onClick={handleSave}
//                 className="p-2 bg-blue-500 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </Modal>
//         </DndContext>
//       </main>
//     </>
//   );
// }

// export default App;





const App = () => {
  return (
    <div>
      {/* <CustomKanban/> */}
      <Documentdnd/>
    </div>
  )
}

export default App