document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('canvas');
    const upload = document.getElementById('upload');
    const saveButton = document.getElementById('save');
    let baseImage = null;
    let arm1 = null;

    // Function to handle image upload
    upload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(f) {
            const imgElement = new Image();
            imgElement.src = f.target.result;
            
            imgElement.onload = function() {
                const scaledWidth = imgElement.width * 2; // Double width
                const scaledHeight = imgElement.height * 1.5; // 50% higher

                const imgInstance = new fabric.Image(imgElement, {
                    left: 0,
                    top: 0,
                    scaleX: scaledWidth / imgElement.width,
                    scaleY: scaledHeight / imgElement.height,
                    selectable: false
                });

                canvas.clear();
                canvas.setWidth(scaledWidth);
                canvas.setHeight(scaledHeight);
                canvas.add(imgInstance);
                baseImage = imgInstance;

                // Add BBB Arms 1 as an overlay
                fabric.Image.fromURL('images/muscular-arm1.png', function(img) {
                    img.scale(0.5 * imgInstance.scaleX); // Scale arm relative to image size
                    img.set({
                        left: 100 * imgInstance.scaleX,
                        top: 100 * imgInstance.scaleY,
                        selectable: true, // Allow selection
                        opacity: 1  // Ensure opacity is 1
                    });
                    canvas.add(img);
                    arm1 = img;
                });
            }
        }
        
        reader.readAsDataURL(file);
    });

    // Function to save the meme
    saveButton.addEventListener('click', function() {
        canvas.discardActiveObject(); // Deselect any active objects
        
        // Generate image URL from canvas
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png'; // Set the download attribute
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Clean up: remove the link from the body
    });

    // Event listener to allow manipulation of arm
    canvas.on('object:selected', function(e) {
        const obj = e.target;
        if (obj === arm1) {
            obj.set({
                borderColor: '#FF0000', // Optional: Highlight selected arm
                cornerColor: '#FF0000', // Optional: Highlight selected arm
                cornerStrokeColor: '#FF0000' // Optional: Highlight selected arm
            });
        }
    });

    canvas.on('selection:cleared', function(e) {
        const obj = e.target;
        if (obj === arm1) {
            arm1.set({
                borderColor: 'transparent', // Reset border color
                cornerColor: 'transparent', // Reset corner color
                cornerStrokeColor: 'transparent' // Reset corner stroke color
            });
        }
    });

    canvas.on('object:scaling', function(e) {
        const obj = e.target;
        obj.setCoords(); // Update object's coordinates

        // Limit scaling to avoid arms going out of image bounds
        if (obj.scaleX > obj.maxScaleFactor) {
            obj.scaleX = obj.maxScaleFactor;
        }
        if (obj.scaleY > obj.maxScaleFactor) {
            obj.scaleY = obj.maxScaleFactor;
        }
    });

    canvas.on('selection:updated', function(e) {
        const obj = e.target;
        if (obj === arm1) {
            arm1 = obj; // Update arm1 reference
        }
    });

});
