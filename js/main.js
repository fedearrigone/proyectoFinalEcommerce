let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
                <button class="producto-saberMas" id="${producto.id}">Saber más</button>
            </div>
        `;

        contenedorProductos.append(div);

        // Agregar evento click para el botón "Saber más" de este producto
        const botonSaberMas = div.querySelector(".producto-saberMas");
        botonSaberMas.addEventListener("click", () => {
            mostrarInformacionProducto(producto);
        });
    });

    actualizarBotonesAgregar();
}

// Agregar evento click a los botones "Saber más" aquí, después de cargar los productos
botonesSaberMas = document.querySelectorAll(".producto-saberMas");

botonesSaberMas.forEach(boton => {
    boton.addEventListener("click", () => {
        const idBoton = boton.id;
        const productoSeleccionado = productos.find(producto => producto.id === idBoton);

        if (productoSeleccionado) {
            mostrarInformacionProducto(productoSeleccionado);
        }
    });
});





// Función para mostrar la información del producto en un modal
function mostrarInformacionProducto(producto) {
    const productoModal = document.getElementById("productoModal");
    const productoInformacion = document.getElementById("productoInformacion");
    const closeModal = document.getElementById("close-modal");

    // Llena el contenido del modal con la información del producto
    productoInformacion.innerHTML = `
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-precio">$${producto.precio}</p>
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <p class="producto-descripcion">${producto.descripcion}</p>
    `;

    // Muestra el modal
    productoModal.style.display = "block";

    // Cierra el modal cuando se hace clic en la "X"
    closeModal.addEventListener("click", () => {
        productoModal.style.display = "none";
    });

    // Cierra el modal cuando se hace clic fuera del modal
    window.addEventListener("click", (event) => {
        if (event.target === productoModal) {
            productoModal.style.display = "none";
        }
    });
}









botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productosCategoria = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = e.currentTarget.innerText; // Cambia el título según el botón de categoría actual
            cargarProductos(productosCategoria);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}









