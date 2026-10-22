class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    vender(cantidad) {
        if (cantidad > 0 && cantidad <= this.stock) {
            this.stock = this.stock - cantidad;
            return true;
        } else {
            return false;
        }
    }

    aplicarDescuento(porcentaje) {
        if (porcentaje > 0 && porcentaje <= 90) {
            this.precio = Math.round(this.precio - (this.precio * porcentaje / 100));
            return true;
        } else {
            return false;
        }
    }

    mostrarInfo() {
        return "#" + this.id + " " + this.nombre + " | Precio: $" + this.precio + " | Stock: " + this.stock;
    }
}

const COSTO_ENVIO = 12000;
const DESCUENTO = 0.1; // 10%
const MINIMO_DESCUENTO = 150000; // desde acá hay descuento

const album = new Producto(1, "Álbum", 65000, 10);
const photocards = new Producto(2, "Pack de photocards", 15000, 20);
const poster = new Producto(3, "Poster", 25000, 8);
const hoodie = new Producto(4, "Hoodie", 120000, 5);
const llavero = new Producto(5, "Llavero", 12000, 15);

const catalogoMerch = [album, photocards, poster, hoodie, llavero];

const carrito = [];

let siguienteId = 6; 
let nombre = "";
let seguirComprando = true;

function pedirCantidad(producto, stock) {
    let cantidad = 0;
    let valido = false;

    while (!valido) {
        const respuesta = prompt("¿Cuántos " + producto + " quieres? (Stock: " + stock + ")\nEscribe 0 para cancelar");

        if (respuesta === null) {
            cantidad = 0;
            valido = true;
        } else {
            cantidad = parseInt(respuesta);

            if (isNaN(cantidad) || cantidad < 0) {
                alert("Cantidad inválida, escribe un número");
            } else if (cantidad > stock) {
                alert("Solo quedan " + stock + " " + producto);
            } else {
                valido = true;
            }
        }
    }

    return cantidad;
}

const calcularSubtotal = (cantidad, precio) => cantidad * precio;

const calcularDescuento = function (subtotalCompra) {
    if (subtotalCompra >= MINIMO_DESCUENTO) {
        return subtotalCompra * DESCUENTO;
    } else {
        return 0;
    }
};

function calcularTotalCarrito(lista) {
    const suma = lista.reduce((acumulado, item) => acumulado + calcularSubtotal(item.cantidad, item.precio), 0);

    return suma;
}

function elegirProducto(lista) {
    if (lista.length === 0) {
        alert("El catálogo está vacío");
        return null;
    }

    let texto = "Elige un producto:\n\n";

    for (let i = 0; i < lista.length; i++) {
        texto = texto + (i + 1) + " - " + lista[i].nombre + " ($" + lista[i].precio + ") - Stock: " + lista[i].stock + "\n";
    }

    const respuesta = prompt(texto);

    if (respuesta === null) {
        return null;
    }

    const numero = parseInt(respuesta);

    if (isNaN(numero) || numero < 1 || numero > lista.length) {
        alert("Número inválido, elige uno de la lista");
        return null;
    }

    return lista[numero - 1];
}

function crearProducto() {
    const nombreNuevo = prompt("¿Cómo se llama el producto?");

    if (nombreNuevo === null || nombreNuevo.trim() === "") {
        alert("No escribiste ningún nombre");
        return null;
    }

    const precioNuevo = parseInt(prompt("¿Cuánto cuesta?"));
    const stockNuevo = parseInt(prompt("¿Cuántas unidades hay en stock?"));

    if (isNaN(precioNuevo) || precioNuevo <= 0 || isNaN(stockNuevo) || stockNuevo < 0) {
        alert("Precio o stock inválido, escribe números");
        return null;
    }

    const productoNuevo = new Producto(siguienteId, nombreNuevo.trim(), precioNuevo, stockNuevo);
    siguienteId++;

    return productoNuevo;
}

function comprarProducto(lista) {
    const producto = elegirProducto(lista);

    if (producto === null) {
        console.log("No se eligió ningún producto");
    } else if (producto.stock === 0) {
        alert(producto.nombre + " está agotado");
    } else {
        const cantidad = pedirCantidad(producto.nombre, producto.stock);

        if (cantidad > 0 && producto.vender(cantidad)) {

            const itemExistente = carrito.find(item => item.id === producto.id);

            if (itemExistente) {

                itemExistente.cantidad = itemExistente.cantidad + cantidad;
            } else {
                carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad });
            }

            alert("Agregaste " + cantidad + " x " + producto.nombre + " al carrito");
            console.log("Agregaste " + cantidad + " x " + producto.nombre);
            console.log("Quedó así: " + producto.mostrarInfo());
        } else {
            console.log("No se agregó nada al carrito");
        }
    }
}

function mostrarMenu() {
    const opcion = prompt(
        "MENÚ\n\n" +
        "1 - Ver catálogo (mira la consola)\n" +
        "2 - Comprar un producto\n" +
        "3 - Buscar un producto por su id\n" +
        "4 - Filtrar productos por precio máximo\n" +
        "5 - Ver solo los productos disponibles\n" +
        "6 - Ver lista de precios con descuento\n" +
        "7 - Ver valor total del inventario\n" +
        "8 - Agregar un producto al catálogo\n" +
        "9 - Quitar el último producto (agotado)\n" +
        "10 - Aplicar descuento a un producto\n" +
        "11 - Ver carrito y pagar\n" +
        "0 - Salir"
    );

    return opcion;
}

function listarCatalogo(lista) {
    console.log("--- Catálogo actual ---");

    for (const producto of lista) {
        console.log(producto.mostrarInfo());
    }

    console.log("Total: " + lista.length + " productos");
}

function buscarPorId(lista) {
    const idBuscado = parseInt(prompt("¿Cuál es el id del producto que buscas?"));

    if (isNaN(idBuscado)) {
        alert("Id inválido, escribe un número");
        return;
    }
    const encontrado = lista.find(producto => producto.id === idBuscado);

    if (encontrado) {
        alert("✅ Producto encontrado:\n" + encontrado.mostrarInfo());
        console.log("✅ Producto encontrado: " + encontrado.mostrarInfo());
    } else {
        alert("❌ No existe un producto con el id " + idBuscado);
        console.log("❌ No existe un producto con el id " + idBuscado);
    }
}

function filtrarPorPrecio(lista) {
    const precioMaximo = parseInt(prompt("¿Cuál es tu presupuesto máximo por producto?"));

    if (isNaN(precioMaximo) || precioMaximo <= 0) {
        alert("Precio inválido, escribe un número mayor a 0");
        return;
    }

    const economicos = lista.filter(producto => producto.precio <= precioMaximo);

    if (economicos.length === 0) {
        alert("No hay productos de $" + precioMaximo + " o menos");
        console.log("Ningún producto cuesta $" + precioMaximo + " o menos");
    } else {
        const texto = economicos.map(producto => "- " + producto.nombre + " ($" + producto.precio + ")").join("\n");
        alert("Productos de $" + precioMaximo + " o menos:\n" + texto);
        console.log("Productos de $" + precioMaximo + " o menos: " + economicos.length);
        console.log(economicos);
    }
}

function mostrarDisponibles(lista) {
    const disponibles = lista.filter(producto => producto.stock > 0);

    const hayAgotados = lista.some(producto => producto.stock === 0);

    if (disponibles.length === 0) {
        alert("Todos los productos están agotados 😢");
    } else {
        const texto = disponibles.map(producto => "- " + producto.nombre + " (quedan " + producto.stock + ")").join("\n");
        alert("Productos disponibles:\n" + texto);
        console.log("Productos disponibles: " + disponibles.length);
        console.log(disponibles);
    }

    if (hayAgotados) {
        alert("⚠️ Ojo: hay productos agotados en el catálogo");
        console.log("Hay al menos un producto agotado");
    }
}

function verPreciosConDescuento(lista) {
    const porcentaje = parseFloat(prompt("¿Qué porcentaje de descuento quieres simular? (1 a 90)"));

    if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 90) {
        alert("El porcentaje debe ser un número entre 1 y 90");
        return;
    }

    const preciosNuevos = lista.map(producto => {
        return {
            nombre: producto.nombre,
            precioOriginal: producto.precio,
            precioConDescuento: Math.round(producto.precio - (producto.precio * porcentaje / 100))
        };
    });

    const texto = preciosNuevos.map(item => "- " + item.nombre + ": $" + item.precioOriginal + " -> $" + item.precioConDescuento).join("\n");

    alert("Precios con " + porcentaje + "% de descuento:\n" + texto);
    console.log("Precios con " + porcentaje + "% de descuento:");
    console.log(preciosNuevos);
}

function calcularValorInventario(lista) {
    const valorTotal = lista.reduce((acumulado, producto) => acumulado + producto.precio * producto.stock, 0);

    alert("El valor total del inventario es $" + valorTotal);
    console.log("Valor total del inventario: $" + valorTotal);

    return valorTotal;
}

function agregarProducto(lista) {
    const productoNuevo = crearProducto();

    if (productoNuevo === null) {
        return;
    }

    const ubicacion = prompt("¿Dónde lo agregas?\n1 - Al final\n2 - Al inicio (prioridad)");

    if (ubicacion === "1") {
        lista.push(productoNuevo);
        alert("Se agregó " + productoNuevo.nombre + " al final del catálogo");
        console.log("push: " + productoNuevo.mostrarInfo());
    } else if (ubicacion === "2") {
        lista.unshift(productoNuevo);
        alert("Se agregó " + productoNuevo.nombre + " al inicio del catálogo");
        console.log("unshift: " + productoNuevo.mostrarInfo());
    } else {
        alert("Opción no válida, no se agregó nada");
    }
}

function quitarUltimo(lista) {
    let eliminado = null;

    if (lista.length > 0) {
        eliminado = lista.pop();
        alert("Se ha eliminado el elemento: " + eliminado.nombre);
        console.log("Se ha eliminado el elemento: " + eliminado.nombre);
    } else {
        alert("El catálogo está vacío, no hay nada que quitar");
    }

    return eliminado;
}

function descontarProducto(lista) {
    const producto = elegirProducto(lista);

    if (producto === null) {
        return;
    }

    const porcentaje = parseFloat(prompt("¿Qué porcentaje de descuento le quieres aplicar a " + producto.nombre + "? (1 a 90)"));

    if (isNaN(porcentaje)) {
        alert("Porcentaje inválido, escribe un número");
    } else if (producto.aplicarDescuento(porcentaje)) {
        alert("Descuento aplicado. Ahora " + producto.nombre + " cuesta $" + producto.precio);
        console.log("Descuento del " + porcentaje + "%: " + producto.mostrarInfo());
    } else {
        alert("El porcentaje debe estar entre 1 y 90");
    }
}

function mostrarResumen(nombreCliente, lista, subtotalCompra, descuentoCompra, totalCompra) {
    let resumen = "Resumen de " + nombreCliente + ":\n";

    for (const item of lista) {
        resumen = resumen + "- " + item.nombre + ": " + item.cantidad + " x $" + item.precio + "\n";
    }

    resumen = resumen + "Subtotal: $" + subtotalCompra + "\n";
    resumen = resumen + "Descuento: $" + descuentoCompra + "\n";
    resumen = resumen + "Envío: $" + COSTO_ENVIO + "\n";
    resumen = resumen + "TOTAL: $" + totalCompra;

    console.log(resumen);
    alert(resumen);
}

function mostrarCuotas(totalCompra) {
    console.log("Opciones de pago:");

    for (let cuotas = 1; cuotas <= 3; cuotas++) {
        const valorCuota = Math.round(totalCompra / cuotas);

        if (cuotas === 1) {
            console.log("- De contado: $" + valorCuota);
        } else {
            console.log("- " + cuotas + " cuotas de $" + valorCuota);
        }
    }
}

function pagar(nombreCliente) {
    let pagado = false;

    if (carrito.length === 0) {
        alert("Tu carrito está vacío, agrega algo primero");
    } else {
        const subtotal = calcularTotalCarrito(carrito);
        const descuento = calcularDescuento(subtotal);
        const total = subtotal - descuento + COSTO_ENVIO;

        mostrarResumen(nombreCliente, carrito, subtotal, descuento, total);
        mostrarCuotas(total);
        alert("¡Gracias por tu compra!");
        pagado = true;
    }

    return pagado;
}

function manejarOpcion(opcion) {
    switch (opcion) {

        case "1":
            listarCatalogo(catalogoMerch);
            alert("Mira la consola (F12) para ver el catálogo");
            break;

        case "2":
            comprarProducto(catalogoMerch);
            break;

        case "3":
            buscarPorId(catalogoMerch);
            break;

        case "4":
            filtrarPorPrecio(catalogoMerch);
            break;

        case "5":
            mostrarDisponibles(catalogoMerch);
            break;

        case "6":
            verPreciosConDescuento(catalogoMerch);
            break;

        case "7":
            calcularValorInventario(catalogoMerch);
            break;

        case "8":
            agregarProducto(catalogoMerch);
            break;

        case "9":
            quitarUltimo(catalogoMerch);
            break;

        case "10":
            descontarProducto(catalogoMerch);
            break;

        case "11": {
            const pagado = pagar(nombre);

            if (pagado) {
                seguirComprando = false;
            }
            break;
        }

        case "0":
        case null: // por si le da a "Cancelar"
            alert("¡Hasta pronto!");
            console.log("El usuario salió sin comprar");
            seguirComprando = false;
            break;

        default:
            alert("Opción no válida, elige entre 0 y 11");
            break;
    }
}

function iniciarSimulador() {
    nombre = prompt("¿Cómo te llamas?");

    if (nombre === null || nombre.trim() === "") {
        nombre = "Once";
    }

    alert("Hola " + nombre + ", bienvenido/a a la Twice Fan Store");
    console.log("Catálogo (array de objetos de la clase Producto):");
    console.log(catalogoMerch);

    while (seguirComprando) {
        const opcion = mostrarMenu();
        manejarOpcion(opcion);
    }

    listarCatalogo(catalogoMerch);
    console.log("Fin del simulador");
}

iniciarSimulador();