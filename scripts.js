// Datos almacenados en memoria
// Datos persistentes con localStorage
let gastos = [];
let ventas = [];
let productos = [];

// === Funciones para persistencia de datos ===
function cargarDatos() {
    const datosGuardados = localStorage.getItem('sweetTastingData');
    if (datosGuardados) {
        try {
            const datos = JSON.parse(datosGuardados);
            gastos = datos.gastos || [];
            ventas = datos.ventas || [];
            productos = datos.productos || [];
            return true;
        } catch (e) {
            console.error("Error al cargar datos:", e);
            return false;
        }
    }
    return false;
}

function guardarDatos() {
    const datos = {
        gastos,
        ventas,
        productos
    };
    localStorage.setItem('sweetTastingData', JSON.stringify(datos));
}

// Inicializar con datos proporcionados
function inicializarDatos() {
    // Cargar datos desde localStorage si existen
    if (!cargarDatos()) {
        // Usar datos iniciales solo si no hay datos guardados
        gastos = [
            { fecha: '2025-07-11', concepto: 'Leche', cantidad: 1, unidad: 'litro', costo: 2100, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Dulce de leche', cantidad: 1, unidad: 'kg', costo: 3200, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Queso crema', cantidad: 2, unidad: 'unidades', costo: 5400, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Chocolinas', cantidad: 1, unidad: 'paquete', costo: 1950, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Coquitas', cantidad: 1, unidad: 'paquete', costo: 1450, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Vainillas', cantidad: 1, unidad: 'paquete', costo: 2600, categoria: 'Ingredientes' },
            { fecha: '2025-07-11', concepto: 'Plantilla etiquetas', cantidad: 1, unidad: 'set', costo: 4500, categoria: 'Marketing' },
            { fecha: '2025-07-11', concepto: 'Envases y crema chantilly', cantidad: 1, unidad: 'set', costo: 8320, categoria: 'Envases' }
        ];
        ventas = [];
        productos = [];
    }

    // Actualizar UI
    actualizarTablaGastos();
    actualizarTablaVentas();
    actualizarTablaProductos();
    actualizarSelectProductos();
    actualizarDashboard();
}

function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar tab seleccionado
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function agregarGasto() {
    const fecha = document.getElementById('fechaGasto').value;
    const concepto = document.getElementById('conceptoGasto').value;
    const cantidad = parseFloat(document.getElementById('cantidadGasto').value);
    const unidad = document.getElementById('unidadGasto').value;
    const costo = parseFloat(document.getElementById('costoGasto').value);
    const categoria = document.getElementById('categoriaGasto').value;
    guardarDatos();
    mostrarNotificacion("Gasto guardado correctamente");

    if (fecha && concepto && cantidad && unidad && costo && categoria) {
        gastos.push({
            fecha,
            concepto,
            cantidad,
            unidad,
            costo,
            categoria
        });

        // Limpiar formulario
        document.getElementById('fechaGasto').value = '';
        document.getElementById('conceptoGasto').value = '';
        document.getElementById('cantidadGasto').value = '';
        document.getElementById('unidadGasto').value = '';
        document.getElementById('costoGasto').value = '';
        document.getElementById('categoriaGasto').value = '';

        actualizarTablaGastos();
        actualizarDashboard();
    } else {
        alert('Por favor completa todos los campos');
    }
}

function actualizarTablaGastos() {
    const tbody = document.getElementById('tablaGastos');
    tbody.innerHTML = '';

    gastos.forEach((gasto, index) => {
        const row = tbody.insertRow();
        const costoUnidad = (gasto.costo / gasto.cantidad).toFixed(2);
        
        row.innerHTML = `
            <td>${gasto.fecha}</td>
            <td>${gasto.concepto}</td>
            <td>${gasto.cantidad}</td>
            <td>${gasto.unidad}</td>
            <td>$${gasto.costo.toLocaleString()}</td>
            <td>${gasto.categoria}</td>
            <td>$${costoUnidad}</td>
            <td><button class="delete-btn" onclick="eliminarGasto(${index})">Eliminar</button></td>
        `;
    });
}

function eliminarGasto(index) {
    gastos.splice(index, 1);
    actualizarTablaGastos();
    actualizarDashboard();
    guardarDatos();
    mostrarNotificacion("Gasto eliminado correctamente");
}

function agregarVenta() {
    const fecha = document.getElementById('fechaVenta').value;
    const producto = document.getElementById('productoVenta').value;
    const cantidad = parseFloat(document.getElementById('cantidadVenta').value);
    const precio = parseFloat(document.getElementById('precioVenta').value);
    const cliente = document.getElementById('clienteVenta').value;
    const metodoPago = document.getElementById('metodoPago').value;
    guardarDatos();
    mostrarNotificacion("Venta registrada correctamente");

    if (fecha && producto && cantidad && precio && metodoPago) {
        ventas.push({
            fecha,
            producto,
            cantidad,
            precio,
            cliente,
            metodoPago,
            total: cantidad * precio
        });

        // Limpiar formulario
        document.getElementById('fechaVenta').value = '';
        document.getElementById('productoVenta').value = '';
        document.getElementById('cantidadVenta').value = '';
        document.getElementById('precioVenta').value = '';
        document.getElementById('clienteVenta').value = '';
        document.getElementById('metodoPago').value = '';

        actualizarTablaVentas();
        actualizarDashboard();
    } else {
        alert('Por favor completa todos los campos obligatorios');
    }
}

function actualizarTablaVentas() {
    const tbody = document.getElementById('tablaVentas');
    tbody.innerHTML = '';

    ventas.forEach((venta, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${venta.fecha}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.precio.toLocaleString()}</td>
            <td>$${venta.total.toLocaleString()}</td>
            <td>${venta.cliente || '-'}</td>
            <td>${venta.metodoPago}</td>
            <td><button class="delete-btn" onclick="eliminarVenta(${index})">Eliminar</button></td>
        `;
    });
}

function eliminarVenta(index) {
    ventas.splice(index, 1);
    actualizarTablaVentas();
    actualizarDashboard();
    guardarDatos();
    mostrarNotificacion("Venta eliminada correctamente");
}

function agregarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value;
    const costoProduccion = parseFloat(document.getElementById('costoProduccion').value);
    const precioVenta = parseFloat(document.getElementById('precioVentaProducto').value);
    const tiempoPreparacion = parseFloat(document.getElementById('tiempoPreparacion').value);
    const categoria = document.getElementById('categoriaProducto').value;
    guardarDatos();
    mostrarNotificacion("Producto agregado correctamente");

    if (nombre && descripcion && costoProduccion && precioVenta && categoria) {
        productos.push({
            nombre,
            descripcion,
            costoProduccion,
            precioVenta,
            tiempoPreparacion,
            categoria
        });

        // Limpiar formulario
        document.getElementById('nombreProducto').value = '';
        document.getElementById('descripcionProducto').value = '';
        document.getElementById('costoProduccion').value = '';
        document.getElementById('precioVentaProducto').value = '';
        document.getElementById('tiempoPreparacion').value = '';
        document.getElementById('categoriaProducto').value = '';

        actualizarTablaProductos();
        actualizarSelectProductos();
    } else {
        alert('Por favor completa todos los campos');
    }
}

function actualizarTablaProductos() {
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';

    productos.forEach((producto, index) => {
        const row = tbody.insertRow();
        const margen = ((producto.precioVenta - producto.costoProduccion) / producto.precioVenta * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.costoProduccion.toLocaleString()}</td>
            <td>$${producto.precioVenta.toLocaleString()}</td>
            <td>${margen}%</td>
            <td>${producto.tiempoPreparacion || '-'} min</td>
            <td>${producto.categoria}</td>
            <td><button class="delete-btn" onclick="eliminarProducto(${index})">Eliminar</button></td>
        `;
    });
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    actualizarTablaProductos();
    actualizarSelectProductos();
    guardarDatos();
    mostrarNotificacion("Producto eliminado correctamente");
}

function actualizarSelectProductos() {
    const select = document.getElementById('productoVenta');
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.nombre;
        option.textContent = producto.nombre;
        select.appendChild(option);
    });
}

function actualizarDashboard() {
    const totalGastado = gastos.reduce((sum, gasto) => sum + gasto.costo, 0);
    const totalVendido = ventas.reduce((sum, venta) => sum + venta.total, 0);
    const gananciaNeta = totalVendido - totalGastado;
    const margenGanancia = totalVendido > 0 ? ((gananciaNeta / totalVendido) * 100).toFixed(1) : 0;

    document.getElementById('totalGastado').textContent = `$${totalGastado.toLocaleString()}`;
    document.getElementById('totalVendido').textContent = `$${totalVendido.toLocaleString()}`;
    document.getElementById('gananciaNeta').textContent = `$${gananciaNeta.toLocaleString()}`;
    document.getElementById('margenGanancia').textContent = `${margenGanancia}%`;

    // Producto más vendido
    const ventasPorProducto = {};
    ventas.forEach(venta => {
        if (ventasPorProducto[venta.producto]) {
            ventasPorProducto[venta.producto] += venta.cantidad;
        } else {
            ventasPorProducto[venta.producto] = venta.cantidad;
        }
    });
    
    const productoMasVendido = Object.keys(ventasPorProducto).reduce((a, b) => 
        ventasPorProducto[a] > ventasPorProducto[b] ? a : b, Object.keys(ventasPorProducto)[0]);
    
    document.getElementById('productoMasVendido').textContent = productoMasVendido || 'No hay ventas registradas';

    // Mejor mes
    const ventasPorMes = {};
    ventas.forEach(venta => {
        if (venta.fecha) {
            const [anio, mes] = venta.fecha.split('-');
            const claveMes = `${anio}-${mes}`;
            if (!ventasPorMes[claveMes]) ventasPorMes[claveMes] = 0;
            ventasPorMes[claveMes] += venta.total;
        }
    });
    let mejorMes = '-';
    let maxVentasMes = 0;
    for (const mes in ventasPorMes) {
        if (ventasPorMes[mes] > maxVentasMes) {
            maxVentasMes = ventasPorMes[mes];
            mejorMes = mes;
        }
    }
    if (mejorMes !== '-') {
        // Formato: YYYY-MM a Mes Año
        const [anio, mes] = mejorMes.split('-');
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        document.getElementById('mejorMes').textContent = `${meses[parseInt(mes, 10) - 1]} ${anio}`;
    } else {
        document.getElementById('mejorMes').textContent = '-';
    }

    // Promedio diario
    const diasConVentas = new Set(ventas.map(v => v.fecha)).size;
    const promedioDiario = diasConVentas > 0 ? (totalVendido / diasConVentas).toFixed(0) : 0;
    document.getElementById('promedioDiario').textContent = `$${promedioDiario}`;
}

function calcularPrecio() {
    const costoIngredientes = parseFloat(document.getElementById('costoIngredientes').value) || 0;
    const costoManoObra = parseFloat(document.getElementById('costoManoObra').value) || 0;
    const gastosGenerales = parseFloat(document.getElementById('gastosGenerales').value) || 0;
    const margenDeseado = parseFloat(document.getElementById('margenDeseado').value) || 0;

    const costoTotal = costoIngredientes + costoManoObra + gastosGenerales;
    let precioVenta = 0;
    let mensaje = '';
    if (margenDeseado >= 100) {
        mensaje = '<span style="color:red">El margen deseado debe ser menor al 100%</span>';
    } else if (margenDeseado < 0) {
        mensaje = '<span style="color:red">El margen deseado no puede ser negativo</span>';
    } else {
        precioVenta = costoTotal / (1 - margenDeseado / 100);
        mensaje = `<strong>Precio de venta recomendado: $${precioVenta.toFixed(2)}</strong><br>
        Costo total: $${costoTotal.toFixed(2)}<br>
        Ganancia: $${(precioVenta - costoTotal).toFixed(2)}`;
    }
    document.getElementById('resultadoPrecio').innerHTML = mensaje;
    document.getElementById('resultadoPrecio').style.display = 'block';
}

function analizarRentabilidad() {
    const precioVenta = parseFloat(document.getElementById('precioVentaAnalisis').value) || 0;
    const costoTotal = parseFloat(document.getElementById('costoTotalAnalisis').value) || 0;
    const cantidadMensual = parseFloat(document.getElementById('cantidadMensual').value) || 0;

    const gananciaPorUnidad = precioVenta - costoTotal;
    const gananciaMensual = gananciaPorUnidad * cantidadMensual;
    const margenPorcentual = precioVenta > 0 ? ((gananciaPorUnidad / precioVenta) * 100).toFixed(1) : 0;

    document.getElementById('resultadoAnalisis').innerHTML = `
        <strong>Ganancia mensual estimada: ${gananciaMensual.toLocaleString()}</strong><br>
        Ganancia por unidad: ${gananciaPorUnidad.toFixed(2)}<br>
        Margen: ${margenPorcentual}%
    `;
    document.getElementById('resultadoAnalisis').style.display = 'block';
}

function calcularPuntoEquilibrio() {
    const gastosFixed = parseFloat(document.getElementById('gastosFixed').value) || 0;
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;
    const costoVariable = parseFloat(document.getElementById('costoVariable').value) || 0;

    const contribucionMarginal = precioUnitario - costoVariable;
    const puntoEquilibrio = contribucionMarginal > 0 ? (gastosFixed / contribucionMarginal) : 0;
    const ventasEquilibrio = puntoEquilibrio * precioUnitario;

    document.getElementById('resultadoEquilibrio').innerHTML = `
        <strong>Punto de equilibrio: ${Math.ceil(puntoEquilibrio)} unidades</strong><br>
        Ventas necesarias: ${ventasEquilibrio.toLocaleString()}<br>
        Contribución marginal: ${contribucionMarginal.toFixed(2)}
    `;
    document.getElementById('resultadoEquilibrio').style.display = 'block';
}

// Función para exportar datos (simulación)
function exportarDatos() {
    const datos = {
        gastos: gastos,
        ventas: ventas,
        productos: productos,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(datos, null, 2);
    const dataUri = 'application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'sweet_tasting_backup_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const contenido = JSON.parse(e.target.result);
                gastos = contenido.gastos || [];
                ventas = contenido.ventas || [];
                productos = contenido.productos || [];
                
                guardarDatos();
                inicializarDatos();
                mostrarNotificacion("Datos importados correctamente");
            } catch (error) {
                mostrarNotificacion("Error al importar archivo", "error");
                console.error("Error al importar:", error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Función para generar reporte mensual
function generarReporteMensual() {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const ventasDelMes = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === anioActual;
    });

    const gastosDelMes = gastos.filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto.getMonth() === mesActual && fechaGasto.getFullYear() === anioActual;
    });

    const totalVentasMes = ventasDelMes.reduce((sum, venta) => sum + venta.total, 0);
    const totalGastosMes = gastosDelMes.reduce((sum, gasto) => sum + gasto.costo, 0);

    alert(`Reporte del mes actual:\nVentas: ${totalVentasMes.toLocaleString()}\nGastos: ${totalGastosMes.toLocaleString()}\nGanancia: ${(totalVentasMes - totalGastosMes).toLocaleString()}\nCantidad de ventas: ${ventasDelMes.length}\nCantidad de gastos: ${gastosDelMes.length}`);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha actual por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaGasto').value = hoy;
    document.getElementById('fechaVenta').value = hoy;

    // Cargar datos iniciales
    inicializarDatos();
    
    // Agregar botones de utilidad al dashboard
    const dashboard = document.getElementById('dashboard');
    const botonesUtilidad = document.createElement('div');
    botonesUtilidad.className = 'form-section';
    botonesUtilidad.innerHTML = `
        <h3>🛠️ Herramientas</h3>
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <button onclick="exportarDatos()">📊 Exportar Datos</button>
            <button onclick="importarDatos()">📂 Importar Datos</button>
            <button onclick="generarReporteMensual()">📋 Reporte Mensual</button>
            <button onclick="location.reload()">🔄 Reiniciar</button>
        </div>
    `;
    dashboard.appendChild(botonesUtilidad);

    console.log('Sistema de control de postres cargado correctamente');
});

// Funciones adicionales para mejorar la experiencia
function buscarEnTabla(tablaId, inputId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toLowerCase();
    const tabla = document.getElementById(tablaId);
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const celdas = fila.getElementsByTagName('td');
        let mostrar = false;

        for (let j = 0; j < celdas.length; j++) {
            const celda = celdas[j];
            if (celda.textContent.toLowerCase().indexOf(filter) > -1) {
                mostrar = true;
                break;
            }
        }

        fila.style.display = mostrar ? '' : 'none';
    }
}

// Validación en tiempo real
function validarNumero(input) {
    const valor = input.value;
    if (valor && isNaN(valor)) {
        input.style.borderColor = '#ff6b6b';
        input.setCustomValidity('Por favor ingresa un número válido');
    } else {
        input.style.borderColor = '#e9ecef';
        input.setCustomValidity('');
    }
}

// Aplicar validación a todos los inputs numéricos
document.addEventListener('DOMContentLoaded', function() {
    const inputsNumericos = document.querySelectorAll('input[type="number"]');
    inputsNumericos.forEach(input => {
        input.addEventListener('input', function() {
            validarNumero(this);
        });
    });
});

// Función para calcular costos automáticamente basado en ingredientes
function calcularCostoAutomatico() {
    const ingredientesComunes = {
        'leche': 2100,
        'dulce de leche': 3200,
        'queso crema': 2700,
        'chocolinas': 1950,
        'coquitas': 1450,
        'vainillas': 2600
    };

    // Esta función se puede expandir para calcular costos automáticamente
    // basado en los ingredientes registrados
    console.log('Calculando costos automáticos...');
}

// Función para agregar recordatorios
function agregarRecordatorio(texto, fecha) {
    const recordatorio = {
        texto: texto,
        fecha: fecha,
        completado: false
    };
    
    // Aquí se guardaría en el almacenamiento local si estuviera disponible
    console.log('Recordatorio agregado:', recordatorio);
}

// Función para generar códigos QR para productos (simulación)
function generarCodigoQR(producto) {
    alert(`Generando código QR para: ${producto.nombre}\nPrecio: ${producto.precioVenta}\nDescripción: ${producto.descripcion}`);
}

// Función para calcular tendencias de ventas
function calcularTendencias() {
    if (ventas.length < 2) return;

    const ventasPorFecha = {};
    ventas.forEach(venta => {
        const fecha = venta.fecha;
        if (ventasPorFecha[fecha]) {
            ventasPorFecha[fecha] += venta.total;
        } else {
            ventasPorFecha[fecha] = venta.total;
        }
    });

    const fechas = Object.keys(ventasPorFecha).sort();
    const ultimasFechas = fechas.slice(-7); // Últimos 7 días
    const ventasUltimaSemana = ultimasFechas.reduce((sum, fecha) => sum + ventasPorFecha[fecha], 0);
    const promedioSemanal = ventasUltimaSemana / ultimasFechas.length;

    console.log(`Tendencia semanal: ${promedioSemanal.toFixed(2)} promedio diario`);
}

// Auto-guardar datos cada 5 minutos (simulación)
setInterval(function() {
    console.log('Auto-guardando datos...');
    // Aquí se guardarían los datos automáticamente
}, 300000); // 5 minutos

// Mostrar notificaciones de éxito
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'success' ? '#00b894' : '#ff6b6b'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}
