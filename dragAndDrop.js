import addGlobalEventListener from "./utils/addGlobalEventListener";

const noop = () => {};
export default function setupDragAndDrop(onDragComplete = noop) {
  addGlobalEventListener("mousedown", "[data-draggable]", (e) => {
    // setupDragItems
    const { selectedItem, clonedItem, ghost, offset } = setupDragItems(e);

    setupDragHandlers(selectedItem, clonedItem, ghost, offset, onDragComplete)
  });
}

function setPosition(node, e, offset) {
  node.style.top = e.clientY - offset.y + "px";
  node.style.left = e.clientX - offset.x + "px";
}

/**
 * @param {Node} element
 * @returns {Node}
 */
function getDropZone(element) {
  const selector = "[data-drop-zone]";

  if (!element.matches) {
    return null;
  }

  if (element.matches(selector)) {
    return element;
  } else {
    return element.closest(selector);
  }
}

function setupDragItems(e) {
  /**
   * @type Node
   */
  const selectedItem = e.target;
  const clonedItem = selectedItem.cloneNode(true);
  // create a ghost div & add it at place of selection
  const ghost = selectedItem.cloneNode();

  const origRect = selectedItem.getBoundingClientRect();
  selectedItem.classList.add("hide");
  clonedItem.classList.add("dragging");
  const offset = {
    y: e.clientY - origRect.y,
    x: e.clientX - origRect.x,
  };
  setPosition(clonedItem, e, offset);
  document.body.append(clonedItem);

  // ghost div
  ghost.classList.remove("hide");
  ghost.classList.add("ghost");
  ghost.style.height = origRect.height + "px";
  const dropZone = getDropZone(selectedItem);
  dropZone.insertBefore(ghost, selectedItem);

  return {
    selectedItem,
    clonedItem,
    ghost,
    offset,
  };
}

function setupDragHandlers(selectedItem, clonedItem, ghost, offset, onDragComplete) {
  // add listener for mousemove
  const mouseMoveHandler = (e) => {
    // set position of cloneItem whenever mousemove event occurs
    setPosition(clonedItem, e, offset);
    // add ghost to dropZone (whenever mouse moved)
    const dropZone = getDropZone(e.target);
    if (dropZone) {
      const closestChild = Array.from(dropZone.children).find((child) => {
        const rect = child.getBoundingClientRect();
        return e.y < rect.top + rect.height / 2;
      });

      if (closestChild) {
        dropZone.insertBefore(ghost, closestChild);
      } else {
        dropZone.append(ghost);
      }
    }
  };

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener(
    "mouseup",
    (e) => {
      document.removeEventListener("mousemove", mouseMoveHandler);

      // get the dropZone on which we are dropping
      const dropZone = getDropZone(e.target);
      clonedItem.classList.remove("dragging");
      if (dropZone) {
        const startZone = getDropZone(selectedItem)
        selectedItem.remove();
        const eventData = {
            startZone,
            endZone: dropZone,
            dragElement: selectedItem,
            index: Array.from(dropZone.children).indexOf(ghost)
        }
        onDragComplete(eventData)
        dropZone.insertBefore(clonedItem, ghost);
      } else {
        clonedItem.remove();
        selectedItem.classList.remove("hide");
      }
      // selectedItem.remove()
      ghost.remove();
    },
    { once: true }
  );
}
