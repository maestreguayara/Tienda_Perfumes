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

    perfumes.forEach((perfume) => {
        const div = document.createElement('div');
        div.classList.add('perfume');
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
            }
        })
        .catch(error => {
            console.error('Error al agregar al carrito:', error);
        });
};

const mostrarCarrito = () => {
    const contenedorCarrito = document.getElementById('productos-carrito');
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        carrito.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('producto-carrito');
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