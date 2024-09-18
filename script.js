const imageUpload = document.getElementById('image-upload');
const topText = document.getElementById('top-text');
const bottomText = document.getElementById('bottom-text');
const generateMeme = document.getElementById('generate-meme');
const memeCanvas = document.getElementById('meme-canvas');
const downloadMeme = document.getElementById('download-meme');
const styleSelector = document.getElementById('style');
const ctx = memeCanvas.getContext('2d');

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

    if (styleSelector.value === 'demotivational') {
        // Set canvas to black background with 16:9 aspect ratio
        const canvasWidth = 800;
        const canvasHeight = 450;
        memeCanvas.width = canvasWidth;
        memeCanvas.height = canvasHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Calculate image dimensions (60% of canvas height)
        const imgHeight = Math.round(canvasHeight * 0.6);
        const imgWidth = Math.round((imgHeight / originalImageDimensions.height) * originalImageDimensions.width);

        // Draw image centered
        const imgX = (canvasWidth - imgWidth) / 2;
        const imgY = (canvasHeight - imgHeight) / 3;
        ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);

        // Set up text style
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        // Draw top text (larger)
        ctx.font = '36px Times New Roman';
        ctx.textBaseline = 'top';
        ctx.fillText(topTextValue, canvasWidth / 2, imgY + imgHeight + 20);

        // Draw bottom text (smaller)
        ctx.font = '18px Times New Roman';
        ctx.textBaseline = 'top';
        ctx.fillText(bottomTextValue, canvasWidth / 2, imgY + imgHeight + 70);
    } else {
        // Existing meme generation code for other styles
        memeCanvas.width = uploadedImage.width;
        memeCanvas.height = uploadedImage.height;
        ctx.drawImage(uploadedImage, 0, 0, memeCanvas.width, memeCanvas.height);

        // Set up text style
        if (styleSelector.value === 'impact') {
            ctx.font = '40px Impact';
        } else if (styleSelector.value === 'arial') {
            ctx.font = '40px Arial';
        }
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';

        // Draw top text with stroke
        ctx.textBaseline = 'top';
        ctx.fillText(topTextValue, memeCanvas.width / 2, 20);
        ctx.strokeText(topTextValue, memeCanvas.width / 2, 20);

        // Draw bottom text with stroke
        ctx.textBaseline = 'bottom';
        ctx.fillText(bottomTextValue, memeCanvas.width / 2, memeCanvas.height - 20);
        ctx.strokeText(bottomTextValue, memeCanvas.width / 2, memeCanvas.height - 20);
    }
});

downloadMeme.addEventListener('click', () => {
    const url = memeCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meme.png';
    a.click();
});