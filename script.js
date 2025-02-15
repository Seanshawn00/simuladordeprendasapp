document.addEventListener('DOMContentLoaded', () => {
    const textOverlay = document.getElementById('text-overlay');
    const textInput = document.getElementById('text-input');
    const colorPicker = document.getElementById('color-picker');
    const fontSizeInput = document.getElementById('font-size');
    const rotateInput = document.getElementById('rotate');
    const shirtImage = document.getElementById('shirt');

    let currentTextElement = null;

    // Cargar la imagen de la remera en base64
    const imageUrl = 'https://http2.mlstatic.com/D_NQ_NP_766940-MLA73611188794_122023-O.webp';
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                shirtImage.src = reader.result; // Asignar la imagen en base64
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => console.error('Error al cargar la imagen:', error));

    function addText() {
        const text = textInput.value.trim();
        if (text === '') return;

        const textElement = document.createElement('div');
        textElement.className = 'draggable-text';
        textElement.textContent = text;
        textElement.style.color = colorPicker.value; // Aplicar el color seleccionado
        textElement.style.fontSize = `${fontSizeInput.value}px`; // Aplicar el tamaño inicial
        textElement.style.transform = `rotate(${rotateInput.value}deg)`; // Aplicar la rotación inicial

        // Posición inicial del texto (centrado en la remera)
        textElement.style.left = '50%';
        textElement.style.top = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';

        // Hacer el texto arrastrable
        let isDragging = false;
        let offsetX, offsetY;

        textElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - textElement.getBoundingClientRect().left;
            offsetY = e.clientY - textElement.getBoundingClientRect().top;
            textElement.style.cursor = 'grabbing';
            currentTextElement = textElement; // Establecer como texto actual
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const shirtRect = textOverlay.getBoundingClientRect();
                const textRect = textElement.getBoundingClientRect();

                // Calcular la nueva posición
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;

                // Restringir el movimiento dentro de los límites de la remera
                x = Math.max(shirtRect.left, Math.min(x, shirtRect.right - textRect.width));
                y = Math.max(shirtRect.top, Math.min(y, shirtRect.bottom - textRect.height));

                textElement.style.left = `${x - shirtRect.left}px`;
                textElement.style.top = `${y - shirtRect.top}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            textElement.style.cursor = 'grab';
        });

        textOverlay.appendChild(textElement);
        textInput.value = '';
    }

    // Cambiar el tamaño del texto
    fontSizeInput.addEventListener('input', () => {
        if (currentTextElement) {
            currentTextElement.style.fontSize = `${fontSizeInput.value}px`;
        }
    });

    // Rotar el texto
    rotateInput.addEventListener('input', () => {
        if (currentTextElement) {
            currentTextElement.style.transform = `rotate(${rotateInput.value}deg)`;
        }
    });

    // Eliminar el texto seleccionado
    function deleteText() {
        if (currentTextElement) {
            textOverlay.removeChild(currentTextElement); // Eliminar el texto
            currentTextElement = null; // Limpiar la referencia
        }
    }

    // Guardar el diseño como JPG
    function saveDesign() {
        const shirtContainer = document.querySelector('.shirt-container');

        // Usar html2canvas para capturar el diseño
        html2canvas(shirtContainer).then((canvas) => {
            // Convertir el canvas a una imagen JPG
            const imgData = canvas.toDataURL('image/jpeg');

            // Crear un enlace para descargar la imagen
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'remera_personalizada.jpg'; // Nombre del archivo
            link.click();
        });
    }

    window.addText = addText;
    window.deleteText = deleteText;
    window.saveDesign = saveDesign;
});
