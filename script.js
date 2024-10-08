const imageUpload = document.getElementById('image-upload');
const topText = document.getElementById('top-text');
const bottomText = document.getElementById('bottom-text');
const generateMeme = document.getElementById('generate-meme');
const memeCanvas = document.getElementById('meme-canvas');
const downloadMeme = document.getElementById('download-meme');
const styleSelector = document.getElementById('style');
// TODO: the "funny caption" style can be improved, look into it.
const darkModeToggle = document.getElementById('dark-mode-toggle'); // Add this line
const ctx = memeCanvas.getContext('2d');
const body = document.body;
let isDrawing = false;
let currentColor = 'black'; // Default drawing color

// Function to set dark mode
function setDarkMode(isDark) {
    body.classList.toggle('dark-mode', isDark);
    darkModeToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    // Store the user's preference
    localStorage.setItem('darkMode', isDark);
}

// Check for user's preference in localStorage or default to dark mode
const prefersDarkMode = localStorage.getItem('darkMode') !== 'false';

// Set initial mode
setDarkMode(prefersDarkMode);

let uploadedImage = null; // Store the uploaded image
let originalImageDimensions = { width: 0, height: 0 }; // Store original image dimensions

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        uploadedImage = new Image();
        uploadedImage.src = reader.result;
        uploadedImage.onload = () => {
            // Store original dimensions
            originalImageDimensions.width = uploadedImage.width;
            originalImageDimensions.height = uploadedImage.height;
            
            // Calculate new dimensions while maintaining aspect ratio
            let newWidth = uploadedImage.width;
            let newHeight = uploadedImage.height;
            const maxWidth = 300;
            const maxHeight = 500;

            // Resize if width exceeds maxWidth
            if (newWidth > maxWidth) {
                newHeight = (maxWidth / newWidth) * newHeight;
                newWidth = maxWidth;
            }

            // Resize if height still exceeds maxHeight
            if (newHeight > maxHeight) {
                newWidth = (maxHeight / newHeight) * newWidth;
                newHeight = maxHeight;
            }

            // Set canvas dimensions to new size
            memeCanvas.width = newWidth;
            memeCanvas.height = newHeight;

            // Draw resized image on canvas
            ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);
        };
    };
    reader.readAsDataURL(file);
});

// Add this event listener outside of other functions
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generateMeme.click();
    }
});

generateMeme.addEventListener('click', () => {
    if (!uploadedImage) {
        alert('Upload an image first.');
        return;
    }

    const topTextValue = topText.value;
    const bottomTextValue = bottomText.value;

    if (styleSelector.value === 'funnycaption') {
        // Funny Caption Style
        const newWidth = uploadedImage.width;
        const newHeight = uploadedImage.height;

        memeCanvas.width = newWidth;
        memeCanvas.height = newHeight;
        ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);

        const textHeight = 80; // Height of the white rectangle
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, newWidth, textHeight);

        ctx.fillStyle = 'black';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        wrapText(ctx, topTextValue, newWidth / 2, textHeight / 2, newWidth - 20, 30);
    } else if (styleSelector.value === 'demotivational') {
        // Set canvas to a square with black background
        const canvasSize = 600; // Square canvas size 
        memeCanvas.width = canvasSize;
        memeCanvas.height = canvasSize;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Calculate image dimensions to fit within 80% of the canvas while maintaining aspect ratio
        const maxImgSize = Math.round(canvasSize * 0.8);
        let imgWidth = originalImageDimensions.width;
        let imgHeight = originalImageDimensions.height;

        if (imgWidth > imgHeight) {
            imgHeight = (maxImgSize / imgWidth) * imgHeight;
            imgWidth = maxImgSize;
        } else {
            imgWidth = (maxImgSize / imgHeight) * imgWidth;
            imgHeight = maxImgSize;
        }

        // Draw image centered in the upper part of the square
        const imgX = (canvasSize - imgWidth) / 2;
        const imgY = (canvasSize - imgHeight) / 4; // Position image in the upper third
        ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);

        // Draw a white border around the image
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4);

        // Center top text (larger)
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Times New Roman';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        wrapText(ctx, topTextValue, canvasSize / 2, imgY + imgHeight + 20, canvasSize - 40, 32);

        // Center bottom text (smaller)
        ctx.font = '16px Times New Roman';
        wrapText(ctx, bottomTextValue, canvasSize / 2, canvasSize - 40, canvasSize - 40, 20);
    } else {
        // Maintain aspect ratio but limit size
        const maxWidth = 600;
        const maxHeight = 600;
        let newWidth = uploadedImage.width;
        let newHeight = uploadedImage.height;

        if (newWidth > maxWidth) {
            newHeight = (maxWidth / newWidth) * newHeight;
            newWidth = maxWidth;
        }
        if (newHeight > maxHeight) {
            newWidth = (maxHeight / newHeight) * newWidth;
            newHeight = maxHeight;
        }

        memeCanvas.width = newWidth;
        memeCanvas.height = newHeight;
        ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);

        // Center top text with stroke
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 36px Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        wrapText(ctx, topTextValue, newWidth / 2, 10, newWidth - 20, 40);

        // Center bottom text with stroke
        ctx.textBaseline = 'bottom';
        wrapText(ctx, bottomTextValue, newWidth / 2, newHeight - 10, newWidth - 20, 40);
    }
});

// Updated wrapText function
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    // Create lines that fit within maxWidth
    for (let word of words) {
        let testLine = currentLine + (currentLine ? ' ' : '') + word;
        let metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    // Calculate total height of text
    let totalHeight = lines.length * lineHeight;

    // Adjust starting y position to center text vertically
    let startY;
    if (context.textBaseline === 'top') {
        startY = y;
    } else if (context.textBaseline === 'bottom') {
        startY = y - totalHeight;
    } else { // 'middle'
        startY = y - totalHeight / 2;
    }

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineY = startY + (i * lineHeight);
        context.strokeText(line, x, lineY);
        context.fillText(line, x, lineY);
    }
}

downloadMeme.addEventListener('click', () => {
    if (uploadedImage) {
        const url = memeCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        a.click();
    } else {
        alert("There's nothing to download!");
    }
});

// Dark Mode Toggle Functionality
darkModeToggle.addEventListener('click', () => {
    setDarkMode(!body.classList.contains('dark-mode'));
});

// Drawing and Erasing Functionality
const drawButton = document.getElementById('draw-button');
const eraseButton = document.getElementById('erase-button');
let isErasing = false; 
drawButton.addEventListener('click', () => {
    // Toggle drawing mode
    isDrawing = !isDrawing;
    drawButton.textContent = isDrawing ? 'Stop Drawing' : 'Draw';
    if (!uploadedImage) {
        alert("Please upload an image first.");
        return;
    }
});

eraseButton.addEventListener('click', () => {
    // Toggle erasing mode
    isErasing = !isErasing;
    // Optionally add visual feedback to the erase button as well
});

memeCanvas.addEventListener('mousedown', startDrawing);
memeCanvas.addEventListener('mousemove', draw);
memeCanvas.addEventListener('mouseup', stopDrawing);

function startDrawing(e) {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
}

function draw(e) {
    if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function stopDrawing() {
    if (isDrawing) {
        ctx.closePath();
    }
}

// Erase Functionality
memeCanvas.addEventListener('mousedown', (e) => {
    if (isErasing) {
        ctx.clearRect(e.offsetX - 10, e.offsetY - 10, 20, 20); // Erase a small rectangle around the click
    }
});
