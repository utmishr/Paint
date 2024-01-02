const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brushSize = document.getElementById("brush-size");
const colorPicker = document.getElementById("color-picker");
const clearCanvas = document.getElementById("clear-canvas");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
let isDrawing = false;

// Initialize the canvas
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight * 0.85;
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

// Stack to store drawing actions
let drawingStack = [];
let currentStep = -1;

function startPosition(e) {
  isDrawing = true;
  draw(e);
}

function endPosition() {
  isDrawing = false;
  ctx.beginPath();
  saveDrawingState();
}

function draw(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingStack = [];
  currentStep = -1;
});

brushSize.addEventListener("input", () => {
  ctx.lineWidth = brushSize.value;
  updateBrushSizeLabel(brushSize.value);
});

function updateBrushSizeLabel(size) {
  const brushSizeLabel = document.getElementById("brush-size-label");
  if (brushSizeLabel) {
    brushSizeLabel.textContent = `Brush Size: ${size}`;
  }
}

const penButton = document.getElementById("pen");
const eraserButton = document.getElementById("eraser");

function activatePen() {
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = colorPicker.value;
}

function activateEraser() {
  ctx.globalCompositeOperation = "destination-out";
  ctx.strokeStyle = "rgba(0, 0, 0, 0)";
}

penButton.addEventListener("click", activatePen);
eraserButton.addEventListener("click", activateEraser);

function saveDrawingState() {
  currentStep++;
  if (currentStep < drawingStack.length) {
    drawingStack = drawingStack.slice(0, currentStep);
  }
  drawingStack.push(canvas.toDataURL());
  updateUndoRedoButtons();
}

function undo() {
  if (currentStep > 0) {
    currentStep--;
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = drawingStack[currentStep];
  }
  updateUndoRedoButtons();
}

function redo() {
  if (currentStep < drawingStack.length - 1) {
    currentStep++;
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = drawingStack[currentStep];
  }
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  undoButton.disabled = currentStep <= 0;
  redoButton.disabled = currentStep >= drawingStack.length - 1;
}

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

/////////////////////////////////////////////////

///////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const editorContainer = document.getElementById("editor-container");
  const editor = document.getElementById("textarea");
  let isDragging = false;
  let startX, startY, startScrollLeft, startScrollTop;

  // Load content from local storage if available
  const savedContent = localStorage.getItem("editorContent");
  if (savedContent) {
    editor.value = savedContent;
  }

  // Save content to local storage on input
  editor.addEventListener("input", function () {
    localStorage.setItem("editorContent", editor.value);
  });
});

function addEditor() {
  const newEditorContainer = document.createElement("div");
  newEditorContainer.className = "editor-box";
  newEditorContainer.style.position = "absolute";
  newEditorContainer.style.top = "0"; // Set to the top of the canvas
  document.querySelector(".canvas-wrapper").appendChild(newEditorContainer);

  const newEditor = document.createElement("textarea");
  newEditor.className = "textarea";

  newEditor.addEventListener("input", function () {
    // You can add additional logic here to handle input events if needed
    localStorage.setItem("editorContent", newEditor.value);
  });

  newEditorContainer.appendChild(newEditor);

  // Make the new editor resizable and draggable using jQuery UI
  $(newEditorContainer)
    .resizable({
      handles: "n, e, s, w, ne, se, sw, nw",
    })
    .draggable({
      handle: "textarea",
    });
}

// Function to change the font of the editor
function changeFont() {
  const textareas = document.querySelectorAll(".textarea");
  const fontSelector = document.getElementById("fontSelector");
  const selectedFont = fontSelector.value;

  textareas.forEach(function (textarea) {
    textarea.style.fontFamily = selectedFont;
  });
}

function changeFontSize() {
  const textareas = document.querySelectorAll(".textarea");
  const fontSizeSelector = document.getElementById("fontSizeSelector");
  const selectedFontSize = fontSizeSelector.value;

  textareas.forEach(function (textarea) {
    textarea.style.fontSize = selectedFontSize;
  });
}
