const imageUpload = document.getElementById('image-upload');
const topText = document.getElementById('top-text');
const bottomText = document.getElementById('bottom-text');
const generateMeme = document.getElementById('generate-meme');
const memeCanvas = document.getElementById('meme-canvas');
const downloadMeme = document.getElementById('download-meme');
const ctx = memeCanvas.getContext('2d');

let uploadedImage = null; // Store the uploaded image

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        uploadedImage = new Image();
        uploadedImage.src = reader.result;
        uploadedImage.onload = () => {
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

generateMeme.addEventListener('click', () => {
    // Redraw the uploaded image before adding text
    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, memeCanvas.width, memeCanvas.height);
    }

    const topTextValue = topText.value;
    const bottomTextValue = bottomText.value;

    // Set up text style
    ctx.font = '40px Impact';
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
});

downloadMeme.addEventListener('click', () => {
    const url = memeCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meme.png';
    a.click();
});