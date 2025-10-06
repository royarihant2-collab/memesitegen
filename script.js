const imageUpload = document.getElementById('imageUpload');
const memeArea = document.getElementById('memeArea');
const addTextBtn = document.getElementById('addText');
const downloadBtn = document.getElementById('downloadMeme');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const fontFamilyInput = document.getElementById('fontFamily');
const templateGallery = document.getElementById('templateGallery');

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

// Load selected meme template
templateGallery.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    image.src = e.target.src;
  }
});

// Upload image from file
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => (image.src = event.target.result);
  reader.readAsDataURL(file);
});

image.onload = () => {
  canvas.width = image.width;
  canvas.height = image.height;
  drawMeme();
};

// Draw meme + text on canvas
function drawMeme() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  document.querySelectorAll('.draggable-text').forEach(el => {
    ctx.font = `${el.style.fontSize} ${el.style.fontFamily}`;
    ctx.fillStyle = el.style.color;
    ctx.textAlign = "center";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeText(el.textContent, parseInt(el.style.left), parseInt(el.style.top));
    ctx.fillText(el.textContent, parseInt(el.style.left), parseInt(el.style.top));
  });
}

// Add draggable text
addTextBtn.addEventListener('click', () => {
  const text = document.createElement('div');
  text.className = 'draggable-text';
  text.textContent = 'Your Text';
  text.style.left = '150px';
  text.style.top = '150px';
  text.style.fontSize = `${fontSizeInput.value}px`;
  text.style.color = fontColorInput.value;
  text.style.fontFamily = fontFamilyInput.value;
  memeArea.appendChild(text);

  makeDraggable(text);
  text.addEventListener('dblclick', () => {
    const newText = prompt('Edit text:', text.textContent);
    if (newText !== null) text.textContent = newText;
  });
});

// Dragging logic
function makeDraggable(el) {
  let isDragging = false, offsetX, offsetY;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });

  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = memeArea.getBoundingClientRect();
      el.style.left = (e.clientX - rect.left - offsetX) + 'px';
      el.style.top = (e.clientY - rect.top - offsetY) + 'px';
    }
  });
}

// Download meme
downloadBtn.addEventListener('click', () => {
  drawMeme();
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});
