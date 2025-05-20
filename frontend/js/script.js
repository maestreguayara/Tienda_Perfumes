const apiUrl = 'http://localhost:3000/api/perfumes';
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const obtenerPerfumes = async () => {
    try {
        const respuesta = await fetch(apiUrl);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const perfumes = await respuesta.json();
        mostrarPerfumes(perfumes);
    } catch (error) {
        console.error('Error al obtener los perfumes:', error);
    }
};

const mostrarPerfumes = (perfumes) => {
    const contenedor = document.getElementById('lista-perfumes');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    perfumes.forEach((perfume, index) => { // Añadido 'index' para retardos AOS
        const div = document.createElement('div');
        div.classList.add('perfume');
        // Añadir atributos AOS dinámicamente
        div.setAttribute('data-aos', 'fade-up'); // Tipo de animación
        div.setAttribute('data-aos-delay', `${100 * index}`); // Retardo progresivo
        div.setAttribute('data-aos-duration', '800'); // Duración de la animación
        div.setAttribute('data-aos-once', 'true'); // Animar solo una vez

        div.innerHTML = `
            <img src="${perfume.imagen_url}" alt="${perfume.nombre}">
            <h3>${perfume.nombre}</h3>
            <p>${perfume.descripcion}</p>
            <p><strong>$${perfume.precio}</strong></p>
            <button class="agregar-carrito" data-id="${perfume.id}">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });

    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
};

const agregarAlCarrito = (e) => {
    const id = parseInt(e.target.getAttribute('data-id'), 10); // Asegurar que id es un número
    const boton = e.target; // Referencia al botón clicado
    const textoOriginal = boton.textContent;
    const colorOriginal = getComputedStyle(boton).backgroundColor; // Obtener color actual del botón

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(perfumes => {
            const perfume = perfumes.find(p => parseInt(p.id, 10) === id); // Asegurar comparación numérica
            if (perfume) {
                const existente = carrito.find(p => parseInt(p.id, 10) === id);
                if (existente) {
                    existente.cantidad++;
                } else {
                    carrito.push({ ...perfume, cantidad: 1 });
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();

                // Feedback visual:
                boton.textContent = '¡Añadido!';
                boton.style.backgroundColor = 'var(--color-acentuado)'; // Usar la variable CSS para el color de éxito
                boton.disabled = true; // Deshabilitar temporalmente

                setTimeout(() => {
                    boton.textContent = textoOriginal;
                    boton.style.backgroundColor = colorOriginal; // Restablecer color original
                    boton.disabled = false; // Habilitar de nuevo
                }, 1000); // Vuelve a la normalidad después de 1 segundo

            } else {
                console.warn("Perfume no encontrado para agregar con ID:", id);
            }
        })
        .catch(error => {
            console.error('Error al agregar al carrito:', error);
            // Si hay un error, el botón vuelve a la normalidad inmediatamente
            boton.textContent = textoOriginal;
            boton.style.backgroundColor = colorOriginal;
            boton.disabled = false;
        });
};

const mostrarCarrito = () => {
    const contenedorCarrito = document.getElementById('productos-carrito');
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        carrito.forEach((producto, index) => { // Añadido 'index' para la animación escalonada
            const div = document.createElement('div');
            div.classList.add('producto-carrito');
            // Añadir retardo para animación de aparición escalonada
            div.style.setProperty('--delay-producto', `${index * 0.1}s`);

            div.innerHTML = `
                <img src="${producto.imagen_url}" alt="${producto.nombre}" class="imagen-carrito">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: 
                    <button class="modificar-cantidad btn-restar" data-id="${producto.id}" data-accion="restar">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="modificar-cantidad btn-sumar" data-id="${producto.id}" data-accion="sumar">+</button>
                </p>
                <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
            `;
            contenedorCarrito.appendChild(div);
        });

        const botonesEliminar = document.querySelectorAll('.eliminar-producto');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });

        const botonesModificar = document.querySelectorAll('.modificar-cantidad');
        botonesModificar.forEach(boton => {
            boton.addEventListener('click', modificarCantidad);
        });

        calcularTotal();
    }
};

const modificarCantidad = (e) => {
    const id = parseInt(e.target.getAttribute('data-id'), 10); // Asegurar que id es un número
    const accion = e.target.getAttribute('data-accion');
    const producto = carrito.find(p => parseInt(p.id, 10) === id); // Asegurar comparación numérica

    if (producto) {
        if (accion === 'sumar') {
            producto.cantidad++;
        } else if (accion === 'restar' && producto.cantidad > 1) {
            producto.cantidad--;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
};

const eliminarProducto = (e) => {
    const id = parseInt(e.target.getAttribute('data-id'), 10); // Asegurar que id es un número
    carrito = carrito.filter(p => parseInt(p.id, 10) !== id); // Asegurar comparación numérica
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
};

const calcularTotal = () => {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    const totalSpan = document.getElementById('total');
    if (totalSpan) {
        totalSpan.textContent = total.toFixed(2);
    }
};

// Mostrar datos según la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lista-perfumes')) {
        obtenerPerfumes();
    }

    if (document.getElementById('productos-carrito')) {
        mostrarCarrito();
    }
});