document.addEventListener('DOMContentLoaded', () => {
    const textOverlay = document.getElementById('text-overlay');
    const textInput = document.getElementById('text-input');
    const colorPicker = document.getElementById('color-picker');
    const fontSizeInput = document.getElementById('font-size');
    const rotateInput = document.getElementById('rotate');

    let currentTextElement = null;

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

    window.addText = addText;
});
