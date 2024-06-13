document.addEventListener('DOMContentLoaded', function() {
    const canvas1 = new fabric.Canvas('canvas1');
    const canvas2 = new fabric.Canvas('canvas2');
    const upload = document.getElementById('upload');
    const saveButton = document.getElementById('save');
    let arm1 = null;
    let arm2 = null;

    // Function to handle image upload
    upload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(f) {
            const imgElement = new Image();
            imgElement.src = f.target.result;
            
            imgElement.onload = function() {
                const maxImageWidth = 400; // Adjust this value as needed
                const maxImageHeight = 400; // Adjust this value as needed

                // Calculate scaled dimensions to fit within canvas
                let scaleX = 1;
                let scaleY = 1;
                if (imgElement.width > maxImageWidth) {
                    scaleX = maxImageWidth / imgElement.width;
                }
                if (imgElement.height > maxImageHeight) {
                    scaleY = maxImageHeight / imgElement.height;
                }
                const scale = Math.min(scaleX, scaleY);

                const imgInstance1 = new fabric.Image(imgElement, {
                    left: 0,
                    top: 0,
                    scaleX: scale,
                    scaleY: scale,
                    selectable: false
                });

                const imgInstance2 = new fabric.Image(imgElement, {
                    left: 0,
                    top: 0,
                    scaleX: scale,
                    scaleY: scale,
                    selectable: false
                });

                canvas1.clear();
                canvas1.setWidth(imgInstance1.width * scale);
                canvas1.setHeight(imgInstance1.height * scale);
                canvas1.add(imgInstance1);

                canvas2.clear();
                canvas2.setWidth(imgInstance2.width * scale);
                canvas2.setHeight(imgInstance2.height * scale);
                canvas2.add(imgInstance2);

                // Add BBB Arms 1 as an overlay on canvas1
                fabric.Image.fromURL('images/muscular-arm1.png', function(img) {
                    img.scale(0.5 * scale);
                    img.set({
                        left: 100 * scale,
                        top: 100 * scale,
                        selectable: false,
                        opacity: 1  // Ensure opacity is 1
                    });
                    canvas1.add(img);
                    arm1 = img;
                });

                // Add BBB Arms 2 as an overlay on canvas2
                fabric.Image.fromURL('images/muscular-arm2.png', function(img) {
                    img.scale(0.5 * scale);
                    img.set({
                        left: 200 * scale,
                        top: 100 * scale,
                        selectable: false,
                        opacity: 1  // Ensure opacity is 1
                    });
                    canvas2.add(img);
                    arm2 = img;
                });
            }
        }
        
        reader.readAsDataURL(file);
    });

    // Function to save the meme
    saveButton.addEventListener('click', function() {
        const dataURL1 = canvas1.toDataURL({
            format: 'png',
            quality: 1
        });

        const dataURL2 = canvas2.toDataURL({
            format: 'png',
            quality: 1
        });

        const link1 = document.createElement('a');
        link1.href = dataURL1;
        link1.download = 'meme1.png';
        link1.click();

        const link2 = document.createElement('a');
        link2.href = dataURL2;
        link2.download = 'meme2.png';
        link2.click();
    });
});

