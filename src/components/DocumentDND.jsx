/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { FlameIcon, PlusCircle, Trash2Icon } from "lucide-react";

import toast, { Toaster } from 'react-hot-toast';

const Documentdnd = () => {
  return (
    <div className="h-screen font-inter w-full text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-3 p-12">
      <Row headingColor="text-neutral-500" cards={cards} setCards={setCards} />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Row = ({ cards, setCards }) => {
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const clearHighlights = () => {
    const indicators = getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
      i.style.width = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);

    // Check if the element is already highlighted
    if (el.element.style.opacity !== "1") {
      clearHighlights();
      el.element.style.opacity = "1";
      el.element.style.width = "200px"; // Adjust the width of the indicator
    }
  };

  const getNearestIndicator = (e, indicators) => {
    const dragX = e.clientX;
    const indicatorsWithOffsets = indicators.map((child) => {
      const box = child.getBoundingClientRect();
      const midX = box.left + box.width / 2;
      const offset = midX - dragX;
      return { element: child, offset };
    });

    let closestIndex = 0;
    let closestDistance = Math.abs(indicatorsWithOffsets[0].offset);

    for (let i = 1; i < indicatorsWithOffsets.length; i++) {
      const distance = Math.abs(indicatorsWithOffsets[i].offset);
      if (distance < closestDistance) {
        closestIndex = i;
        closestDistance = distance;
      }
    }

    return indicatorsWithOffsets[closestIndex];
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-row="tasks"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  return (
    <div className="w-screen overflow-x-auto hide-scrollbar">
      <div className="fixed right-0 z-10 top-0 w-24 h-full bg-gradient-to-r from-transparent via-[#f1f0ee] to-[#f1f0ee]"></div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex gap-3"
      >
        {cards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} />
        <AddCard setCards={setCards} />
      </div>
    </div>
  );
};
const Card = ({ title, tag, content, color, id, handleDragStart }) => {
  const handleDrag = (e) => {
    e.currentTarget.classList.add("dragging");
  };

  return (
    <div className="flex">
      <DropIndicator beforeId={id} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => {
          handleDragStart(e, { title, id });
          handleDrag(e);
        }}
        onDragEnd={(e) => {
          e.currentTarget.classList.remove("dragging");
        }}
        className="relative overflow-hidden cursor-grab rounded-2xl  bg-white flex flex-col h-[400px] p-10 shrink-0 w-96 active:cursor-grabbing "
      >
        <span
          className={`px-2 py-1 ${color} w-fit font-semibold rounded-md uppercase text-sm `}
          style={{
            maxWidth: "400px",

            whiteSpace: "nowrap",
          }}
        >
          {tag.length > 30 ? tag.slice(0, 30) + "..." : tag}
        </span>

        <p
          className="text-xl font-semibold mt-4 text-neutral-600 "
          style={{
            maxWidth: "400px", // Adjust the maximum width as needed
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <p className="text-base mt-2 text-neutral-500"> {content}</p>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-neutral-50/90 to-transparent rounded-b-2xl pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

const DropIndicator = ({ beforeId }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-row="tasks"
      className="w-0 h-96 border-2 flex place-items-center justify-center border-dashed border-black rounded-md transition-all duration-200 ease-in-out"
    >
      <PlusCircle className="w-6 h-6 text-neutral-500" />
    </div>
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`absolute bottom-10 left-1/4 translate-x-1/4 ml-16 grid h-56 w-56 shrink-0 place-content-center rounded-xl border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-400/20 text-neutral-500"
      }`}
    >
      {active ? (
        <FlameIcon className="animate-bounce w-8 h-8" />
      ) : (
        <Trash2Icon className="w-8 h-8" />
      )}
    </div>
  );
};

const AddCard = ({ setCards }) => {
  const [text, setText] = useState("");
  const [title, setHeading] = useState("");
  const [tag, setTag] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // State to store the selected color
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!text.trim().length || !title.trim().length || !tag.trim().length || !selectedColor) {
    // Display a toast notification for validation failure
    toast.error('Please fill in all fields and select a color.');
    return;
  }

  const newCard = {
    column: 'tasks',
    title: title.trim(),
    tag: tag.trim(),
    content: text.trim(),
    id: Math.random().toString(),
    color: selectedColor,
  };

  setCards((prevCards) => [...prevCards, newCard]);
  setAdding(false);
};

  // Function to handle radio button selection
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Predefined tag colors
  const tagColors = [
    { color: "bg-red-500", label: "Red" },
    { color: "bg-blue-500", label: "Blue" },
    { color: "bg-green-500", label: "Green" },
    { color: "bg-purple-500", label: "Purple" },
    { color: "bg-yellow-500", label: "Yellow" },
    { color: "bg-orange-500", label: "Orange" },
  ];

  return (
    <>
      {adding ? (
        <motion.form
          onSubmit={handleSubmit}
          className="absolute p-6 w-[400px] z-10 text-neutral-700 shadow-lg left-1/2 top-1/2 flex flex-col gap-3 rounded-xl -translate-x-2/3 mt-12 mr-12 bg-white -translate-y-1/2 border "
        >
          <h2 className="mb-4 text-lg font-bold">New card</h2>
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm text-neutral-600">
              Title
            </label>
            <input
              onChange={(e) => setHeading(e.target.value)}
              value={title}
              type="text"
              id="title"
              className="w-full px-2 py-1 border rounded-md border-neutral-200"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="tag" className="text-sm text-neutral-600">
              Tag
            </label>
            <input
              onChange={(e) => setTag(e.target.value)}
              value={tag}
              type="text"
              id="tag"
              className="w-full px-2 py-1 border rounded-md border-neutral-200"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="text" className="text-sm text-neutral-600">
              Content
            </label>
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              id="text"
              className="w-full px-2 py-1 border rounded-md border-neutral-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-neutral-600">Tag Color</label>
            <div className="flex flex-wrap gap-2">
              {tagColors.map(({ color }) => (
                <label key={color} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => handleColorChange(color)}
                    className="hidden"
                  />
                  <span
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                      selectedColor === color
                        ? "border-neutral-800"
                        : "border-white"
                    } ${color}`}
                    onClick={() => handleColorChange(color)}
                  ></span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setAdding(false)}
              type="button"
              className="px-3 py-1 hover:bg-neutral-100 text-sm text-neutral-600 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-neutral-800 hover:bg-neutral-700 border rounded-md"
            >
              Add
            </button>
            <Toaster />

          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2  absolute bottom-10 text-lg font-semibold left-1/2 ml-16 -translate-x-1/2 outline-dashed outline-[2px] border-neutral-300/60 text-neutral-400 transition-colors w-56 h-56 hover:text-neutral-800 hover:shadow-xl rounded-xl"
        >
          <span>Create new doc</span>
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_CARDS = [
  {
    title: "Look into render bug in dashboard",
    color: "bg-red-500",
    tag: "Bug",
    content:
      "The Dashboard is not rendering properly. Need to investigate. Lets dive into how to reproduce the error , firstly check the console for any errors and then check the network tab for any failed requests.  Check the SOX compliance checklist Then nmake sure all items are checked off. If not, fix them! If you're not sure, ask your manager. If your manager doesn't know, ask HR. Good luck!",
    id: "1",
    column: "tasks",
  },
  {
    title: "SOX compliance checklist",
    color: "bg-blue-500",
    tag: "Compliance",
    content:
      "SOX compliance is a big deal. We need to make sure we're following the rules. 1. Check the SOX compliance checklist 2. Make sure all items are checked off 3. If not, fix them! 4. If you're not sure, ask your manager. 5. If your manager doesn't know, ask HR. 6. If HR doesn't know, ask legal. 7. If legal doesn't know, ask the CEO. 8. If the CEO doesn't know, you're on your own. Good luck!",
    id: "2",
    column: "tasks",
  },
  {
    title: "[SPIKE] Migrate to Azure",
    color: "bg-green-500",
    tag: "Spike",
    content:
      " We need to migrate our services to Azure. This is a big project and will take some time. 1. Set up an Azure account 2. Migrate the services 3. Test everything 4. Go live! 5. Celebrate! 6. Profit! 7. Retire to a tropical island 8. Live happily ever after",
    id: "3",
    column: "tasks",
  },
  {
    title: "Document Notifications service",
    color: "bg-purple-500",
    tag: "Documentation",
    content:
      "The Notifications service is not well documented. We need to fix that. 1. Write documentation 2. Review documentation 3. Publish documentation 4. Profit! 5. Retire to a tropical island 6. Live happily ever after",
    id: "4",
    column: "tasks",
  },
  {
    title: "Research DB options for new microservice",
    color: "bg-yellow-500",
    tag: "Research",
    content:
      " Research Database  options for new microservice. 1. Check the SOX compliance checklist 2. Make sure all items are checked off 3. If not, fix them! 4. If you're not sure, ask your manager. 5. If your manager doesn't know, ask HR. 6. If HR doesn't know, ask legal. 7. If legal doesn't know, ask the CEO. 8. If the CEO doesn't know, you're on your own. Good luck!",
    id: "5",
    column: "tasks",
  },
  {
    title: "Postmortem for outage",
    color: "bg-orange-500",
    tag: "Postmortem",
    content:
      " Postmortem for outage. 1. Set up an Azure account 2. Migrate the services 3. Test everything 4. Go live! 5. Celebrate! 6. Profit! 7. Retire to a tropical island 8. Live happily ever after",
    id: "6",
    column: "tasks",
  },
];

export default Documentdnd;
