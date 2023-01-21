
//ENTREGA FINAL LAURENTI GASPAR
//CARRITO DE COMPRAS

let carritoLocal;
let productos = [];
let carrito = [];
let dolarTarjeta = 0;
let totalCompra = 0;
let datosUser;

//CLASE PRODUCTO
class Producto {
    constructor(id, nombre, precio, img, descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = 1;
        this.descripcion = descripcion
    }
}


//RECUPERO EL CARRITO DEL LOCALSTORAGE EN CASO DE EXISTIR
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    carritoLocal = true;
} else {
    carritoLocal = false;
}

const menuNavegacion = document.getElementById("navbarSupportedContent");


//UTILIZO API RANDOMUSER PARA SIMULACION DE USUARIO LOGUEADO
urlApi = "https://randomuser.me/api/"

fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then((datos) => {
        datosUser = datos;
        const avatar = document.createElement("div");
        //avatar.classList.add("avatar");
        const img = datos['results'][0]['picture']['medium'];
        avatar.innerHTML = `
        <img src="${img}" alt="Avatar" class="avatar" id="imgAvatar">
        `
        menuNavegacion.appendChild(avatar);

        imgAvatar = document.getElementById("imgAvatar");
        imgAvatar.addEventListener("click", () => {
            swal({
                title: `${datos['results'][0]['name']['first']} ${datos['results'][0]['name']['last']}`,
                icon: `${img}`,
                text: `${datos['results'][0]['email']}`,
            })
        })
    })
    .catch(error => console.log(error))

const contenedorProductos = document.getElementById("cardProductos");

//MUESTRO GIFT CARGANDO PRODUCTOS HASTA QUE SE CARGUEN LOS MISMOS DESDE LA API
const cargando = document.createElement("div");
cargando.innerHTML = `
<img src="./assets/cargando.gif">
<h2> Cargando Productos, aguarde por favor... </h2>`
contenedorProductos.appendChild(cargando);

//UTILIZO LA API DE CRIPTOYA PARA TRAER PRECIO DE DOLAR SOLIDARIO YA QUE LOS PRECIOS DE LA TIENDA SE MUESTRAN EN DOLARES
const criptoYa = "https://criptoya.com/api/dolar";

setInterval(() => {
    fetch(criptoYa)
        .then(respuesta => respuesta.json())
        .then((dolares) => {
            dolarTarjeta = dolares['solidario'];
        })
        .catch(error => console.log(error))
}, 1000)

//UTILIZO API "FAKESTORE API" PARA TRAER PRODUCTOS DE LA TIENDA
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
        contenedorProductos.removeChild(cargando);
        json.forEach(producto => {
            const item = new Producto(producto['id'], producto['title'], producto['price'], producto['image'], producto['description']);
            productos.push(item);
            const card = document.createElement("div");
            card.classList.add("col", "col-12", "col-md-4");
            card.innerHTML = `
                        <div class="card m-2">
                            <img src="${producto['image']}" class="card-img-top" alt="${producto['title']}">
                            <div class="card-body">
                                <h4 class="card-title">${producto['title']}</h4>
                                <h5 class="card-title">USD ${producto['price']}</h5>
                                <p class="card-text">"${producto['description']}"</p>
                                <button type="button" class="btn botones2" id="botonCarrito${producto['id']}">Agregar al Carrito</button>
                            </div>
                        </div>`
            contenedorProductos.appendChild(card);
            const botonCarrito = document.getElementById(`botonCarrito${producto['id']}`);
            botonCarrito.addEventListener("click", () => {
                agregarAlCarrito(producto['id']);
            });
        })
    }
    )
    .catch(error => console.log(error))

//FUNCION AGREGAR AL CARRITO
const agregarAlCarrito = (id) => {
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const producto = productos.find(producto => producto.id === id);
        carrito.push(producto);
    }
    mostrarCarrito();
    Toastify({
        text: "PRODUCTO AGREGADO AL CARRITO",
        duration: 3000,
        newWindow: true,
        gravity: "bottom",
        position: "right", 
        stopOnFocus: true,
        style: {
            background: "white",
            color: "black",
        },
    }).showToast();
}

const btnVerCarrito = document.getElementById("btnVerCarrito");
btnVerCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

const cardCarrito = document.getElementById("cardCarrito");
const tituloCarrito = document.getElementById("tituloCarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");

//FUNCION MOSTRAR CARRITO
const mostrarCarrito = () => {
    cantidadCarrito.innerText = `${carrito.length}`;
    cardCarrito.innerHTML = "";
    carrito.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col", "col-12", "col-md-4");
        card.innerHTML = `
        <div class="card m-2">
            <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h4 class="card-title">${producto.nombre}</h4>
                <h5 class="card-title">$${producto.precio}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <h4 class="cantidad">${producto.cantidad} UNIDADES</h4>
                <button type="button" class="btn botones2" id="eliminar${producto.id}">Eliminar Producto</button>
            </div>
        </div>`

        cardCarrito.appendChild(card);

        const btnEliminar = document.getElementById(`eliminar${producto.id}`);
        btnEliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        });

    });
    calcularTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//FUNCION ELIMINAR PRODUCTO DEL CARRITO
const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();
}

const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");

btnVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
    swal({
        text: "Se ha vaciado el carrito correctamente!",
    });
});

//FUNCION VACIAR CARRITO
const vaciarCarrito = () => {
    carrito = [];
    mostrarCarrito();
}

const costoTotal = document.getElementById("costoTotal");

//FUNCION CALCULAR COSTO TOTAL
const calcularTotal = () => {
    totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    });
    costoTotal.innerHTML = `${totalCompra.toFixed(2)}`;
}

//MUESTRO EL CARRITO LUEGO DE CARGAR TODOS LOS PRODUCTOS EN CASO DE QUE HAYA CARRITO LOCAL
if (carritoLocal) {
    mostrarCarrito();
}

//SIMULACION DE COMPRA DE PRODUCTOS
btnComprar = document.getElementById("btnComprar");

btnComprar.addEventListener("click", () => {
    carrito.length == 0
        ? swal({
            text: "No hay productos en el carrito!",
        })
        : swal({
            title: "Esta seguro que desea realizar la compra?",
            text: `El total de su compra es de USD${totalCompra}. \n El total de su compra en pesos es de $${(totalCompra * dolarTarjeta).toFixed(2)} \n \n 1USD = ${dolarTarjeta.toFixed(2)} \n Fuente: Cotizacion dolar solidario CriptoYa.com.`,
            icon: "warning",
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Su compra se ha realizado con exito! Muchas gracias por elegirnos.", {
                        icon: "success",
                    });
                    vaciarCarrito();
                } else {
                    swal("Su compra NO se ha realizado!");
                }
            });
})




