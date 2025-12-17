# 🐾 Sistema de Gestión de Maltrato Animal y Adopción Responsable

<div align="center">


**Plataforma digital integral para el registro, seguimiento y gestión de casos de maltrato animal y procesos de adopción responsable**

*Instituto Tecnológico de Tijuana - Departamento de Ingeniería Eléctrica y Electrónica*


</div>

---

## 📑 Tabla de Contenidos

- [Introducción](#-introducción)
- [Planteamiento del Problema](#planteamiento-del-problema)
- [Objetivos](#objetivos)
- [Características del Sistema](#características-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso del Sistema](#uso-del-sistema)
- [Resultados Esperados](#resultados-esperados)
- [Licencia](#licencia)

---

## 📖 Introducción

El Instituto Tecnológico de Tijuana, desde su fundación en 1971, se ha consolidado como una institución comprometida con la formación integral de profesionistas capaces de aportar soluciones innovadoras a problemas de impacto social, tecnológico y ambiental.

Este proyecto se desarrolla dentro del **Departamento de Ingeniería Eléctrica y Electrónica**, como parte del compromiso académico de integrar la tecnología con necesidades reales de la sociedad.

### 🎯 Propósito

En México, el maltrato animal y la falta de mecanismos eficientes para la adopción responsable representan una problemática persistente. El **Sistema de Gestión de Maltrato Animal y Adopción Responsable** surge como una solución tecnológica integral que permite:

- 📝 Centralizar información sobre animales rescatados
- 🚨 Gestionar reportes ciudadanos de maltrato
- 🏠 Administrar procesos de adopción responsable
- 📊 Garantizar datos estructurados y protegidos
- 🔍 Facilitar seguimiento post-adoptivo

---

## ⚠️ Planteamiento del Problema

### Situación Actual

En México, el bienestar animal continúa siendo una problemática social significativa que afecta tanto a entornos urbanos como rurales. A pesar de las leyes de protección animal, su aplicación es limitada debido a:

1. **Falta de herramientas tecnológicas** para registrar y dar seguimiento sistemático a casos
2. **Información dispersa e incompleta** sin mecanismos de verificación
3. **Dificultades de coordinación** entre refugios, asociaciones y autoridades
4. **Gestión manual de información** mediante hojas de cálculo o documentos independientes

### Consecuencias

- ❌ Pérdida de información crítica
- ❌ Duplicación de datos y errores administrativos
- ❌ Tiempo de respuesta prolongado
- ❌ Dificultad para identificar patrones y reincidencias
- ❌ Limitación en la trazabilidad de casos

### Necesidad Identificada

Desarrollar un **sistema de gestión basado en bases de datos** que automatice y organice integralmente la información relacionada con casos de maltrato animal y adopciones.

---

## 🎯 Objetivos

### Objetivo General

Desarrollar un sistema de gestión basado en bases de datos que permita **registrar, organizar y consultar** información relacionada con casos de maltrato animal y procesos de adopción responsable, mejorando el control y seguimiento de estas problemáticas.

### Objetivos Específicos

1. 🗄️ **Diseñar una base de datos estructurada** para almacenar información de reportes de maltrato, animales rescatados y solicitudes de adopción

2. 💻 **Implementar un prototipo funcional** que permita el registro, consulta y actualización de datos de manera eficiente

3. ✅ **Garantizar la consistencia e integridad** de la información mediante un modelo de datos adecuado

4. 🧪 **Evaluar el funcionamiento del sistema** en un entorno de desarrollo controlado para verificar su operatividad básica

---

## ✨ Características del Sistema

### Módulos Principales

- 🚨 **Gestión de Reportes**: Registro y seguimiento de denuncias de maltrato
- 🐕 **Control de Animales**: Base de datos completa de animales rescatados
- 📋 **Proceso de Adopción**: Administración de solicitudes y seguimiento
- 👤 **Panel Administrativo**: Control total del sistema
- 🏥 **Área Veterinaria**: Gestión de historiales médicos
- 📊 **Dashboard**: Visualización de estadísticas y métricas

### Funcionalidades

✅ Sistema CRUD completo (Crear, Leer, Actualizar, Eliminar)  
✅ Autenticación de usuarios por roles  
✅ Carga de imágenes y documentos  
✅ Interfaz responsive y adaptable  
✅ Base de datos estructurada y normalizada  
✅ Seguimiento de casos en tiempo real  

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Backend y servidor |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Lógica del cliente y servidor |
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Estructura de páginas |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Estilos y diseño responsivo |

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** (versión 14.x o superior)
- ✅ **npm** (Node Package Manager)
- ✅ Navegador web moderno (Chrome, Firefox, Edge, Safari)
- ✅ Editor de código (recomendado: VS Code)

### Verificar instalación

```bash
node --version
npm --version
```

Si no tienes Node.js, descárgalo desde [nodejs.org](https://nodejs.org/)

---

## ⚙️ Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/23212806-debug/sistema_animal_code.git
```

### 2️⃣ Navegar al directorio

```bash
cd sistema_animal_code
```

### 3️⃣ Instalar dependencias

```bash
npm install
```

---

## 🔧 Configuración

### Archivo .env

Crea o verifica el archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_animal
```

### Base de Datos

Asegúrate de tener configurada tu base de datos según el modelo del proyecto.

---

## 📁 Estructura del Proyecto

```
sistema_animal/
├── public/
│   ├── css/
│   │   ├── dashboard.css
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── admin.html
│   ├── animales.html
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── reportar.html
│   └── veterinario.html
├── uploads/
│   ├── carpeta-animales/
│   └── carpeta-reportes/
├── server.js
└── .env
```

### Descripción de Carpetas

| Carpeta/Archivo | Descripción |
|-----------------|-------------|
| `public/` | Archivos estáticos del frontend |
| `public/css/` | Hojas de estilo |
| `public/js/` | Scripts del cliente |
| `uploads/` | Almacenamiento de imágenes y documentos |
| `server.js` | Servidor principal de Node.js |
| `.env` | Variables de entorno |

---

## 🗄️ Base de Datos

### Modelo de Datos

```

### 📋 Tablas del Sistema

#### 1. **usuarios** - Gestión de Usuarios del Sistema
Almacena información de todos los usuarios registrados con diferentes roles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `nombre` | VARCHAR(100) | Nombre completo del usuario |
| `email` | VARCHAR(100) | Correo electrónico (UNIQUE) |
| `password` | VARCHAR(255) | Contraseña encriptada |
| `telefono` | VARCHAR(20) | Número de contacto |
| `direccion` | VARCHAR(255) | Dirección del usuario |
| `tipo` | ENUM | Rol: 'usuario', 'veterinario', 'admin' |
| `activo` | BOOLEAN | Estado de la cuenta |
| `fecha_registro` | TIMESTAMP | Fecha de registro |

**Roles del Sistema:**
- 👤 **Usuario**: Puede reportar maltrato y solicitar adopciones
- 🏥 **Veterinario**: Gestiona historial médico y vacunas
- 👨‍💼 **Admin**: Control total del sistema

---

#### 2. **animales** - Registro de Animales
Contiene información completa de todos los animales en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `nombre` | VARCHAR(100) | Nombre del animal |
| `especie` | ENUM | 'perro', 'gato', 'otro' |
| `raza` | VARCHAR(100) | Raza específica |
| `edad` | VARCHAR(20) | Edad aproximada |
| `sexo` | ENUM | 'macho', 'hembra' |
| `tamano` | ENUM | 'pequeño', 'mediano', 'grande' |
| `descripcion` | TEXT | Descripción detallada |
| `fotos` | JSON | Array de URLs de fotos |
| `salud` | TEXT | Estado de salud general |
| `estado` | ENUM | 'disponible', 'reservado', 'adoptado', 'tratamiento' |
| `ubicacion` | VARCHAR(255) | Ubicación actual |
| `creado_por` | INT | ID del usuario creador (FK) |
| `veterinario_id` | INT | ID del veterinario asignado (FK) |
| `actualizado_en` | TIMESTAMP | Última actualización |
| `creado_en` | TIMESTAMP | Fecha de registro |

**Estados del Animal:**
- ✅ **Disponible**: Listo para adopción
- 🔒 **Reservado**: En proceso de adopción
- 🏠 **Adoptado**: Ya tiene hogar
- 🏥 **Tratamiento**: Requiere atención médica

---

#### 3. **reportes** - Denuncias de Maltrato
Registra todas las denuncias ciudadanas sobre maltrato animal.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `usuario_id` | INT | Usuario que reporta (FK) |
| `titulo` | VARCHAR(200) | Título del reporte |
| `descripcion` | TEXT | Descripción detallada del caso |
| `tipo_reporte` | ENUM | 'abuso', 'abandono', 'maltrato', 'otro' |
| `ubicacion` | VARCHAR(255) | Lugar del incidente |
| `fotos` | JSON | Evidencias fotográficas |
| `estado` | ENUM | 'pendiente', 'revisado', 'resuelto' |
| `notas_admin` | TEXT | Notas del administrador |
| `revisado_por` | INT | ID del admin que revisó (FK) |
| `fecha_reporte` | TIMESTAMP | Fecha de la denuncia |
| `fecha_revision` | TIMESTAMP | Fecha de revisión |

**Tipos de Reporte:**
- 🚨 **Abuso**: Maltrato activo
- 📦 **Abandono**: Animal dejado en la calle
- ⚠️ **Maltrato**: Negligencia o descuido
- 📝 **Otro**: Otras situaciones

---

#### 4. **adopciones** - Solicitudes de Adopción
Gestiona todo el proceso de adopción de animales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `usuario_id` | INT | Usuario solicitante (FK) |
| `animal_id` | INT | Animal a adoptar (FK) |
| `motivo` | TEXT | Razón para adoptar |
| `vivienda` | VARCHAR(100) | Tipo de vivienda |
| `tiene_otros_animales` | BOOLEAN | Tiene otras mascotas |
| `estado` | ENUM | 'pendiente', 'aprobada', 'rechazada' |
| `notas_admin` | TEXT | Observaciones del admin |
| `revisado_por` | INT | Admin que revisó (FK) |
| `fecha_solicitud` | TIMESTAMP | Fecha de solicitud |
| `fecha_resolucion` | TIMESTAMP | Fecha de decisión |

**Flujo de Adopción:**
1. 📝 Usuario envía solicitud
2. 👀 Admin revisa información
3. ✅ Aprobación o ❌ Rechazo
4. 🏠 Seguimiento post-adopción

---

#### 5. **historial_medico** - Historial Veterinario
Registro completo de atenciones médicas de cada animal.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `animal_id` | INT | Animal atendido (FK) |
| `veterinario_id` | INT | Veterinario que atendió (FK) |
| `tipo_atencion` | VARCHAR(100) | Tipo de consulta |
| `diagnostico` | TEXT | Diagnóstico médico |
| `tratamiento` | TEXT | Tratamiento aplicado |
| `medicamentos` | TEXT | Medicamentos recetados |
| `fecha_atencion` | DATE | Fecha de la consulta |
| `proxima_cita` | DATE | Siguiente cita programada |
| `costo` | DECIMAL(10,2) | Costo de la atención |
| `notas` | TEXT | Observaciones adicionales |
| `fecha_registro` | TIMESTAMP | Fecha de registro |

---

#### 6. **vacunas** - Control de Vacunación
Seguimiento de todas las vacunas aplicadas a los animales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `animal_id` | INT | Animal vacunado (FK) |
| `tipo_vacuna` | VARCHAR(100) | Nombre de la vacuna |
| `fecha_aplicacion` | DATE | Fecha de aplicación |
| `fecha_proxima` | DATE | Próxima dosis |
| `lote` | VARCHAR(50) | Número de lote |
| `notas` | TEXT | Observaciones |
| `aplicado_por` | INT | Veterinario que aplicó (FK) |
| `fecha_registro` | TIMESTAMP | Fecha de registro |

---

#### 7. **historial_estados** - Trazabilidad de Cambios
Auditoría de todos los cambios de estado de los animales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `animal_id` | INT | Animal modificado (FK) |
| `usuario_id` | INT | Usuario que hizo el cambio (FK) |
| `estado_anterior` | VARCHAR(50) | Estado previo |
| `estado_nuevo` | VARCHAR(50) | Nuevo estado |
| `razon` | TEXT | Motivo del cambio |
| `fecha_cambio` | TIMESTAMP | Fecha del cambio |

---

#### 8. **solicitudes_veterinario** - Solicitudes de Veterinarios
Gestión de solicitudes para obtener rol de veterinario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK) |
| `usuario_id` | INT | Usuario solicitante (FK) |
| `experiencia` | TEXT | Experiencia profesional |
| `especialidad` | VARCHAR(100) | Área de especialización |
| `estado` | ENUM | 'pendiente', 'aprobada', 'rechazada' |
| `revisado_por` | INT | Admin que revisó (FK) |
| `fecha_solicitud` | TIMESTAMP | Fecha de solicitud |
| `fecha_resolucion` | TIMESTAMP | Fecha de decisión |

---

### 🔗 Relaciones entre Tablas

```sql
-- Relaciones Principales
usuarios (1) ──── (N) animales
usuarios (1) ──── (N) reportes
usuarios (1) ──── (N) adopciones
animales (1) ──── (N) historial_medico
animales (1) ──── (N) vacunas
animales (1) ──── (N) historial_estados
veterinarios (1) ──── (N) historial_medico
```

### 📈 Características de la Base de Datos

✅ **Normalización**: Diseño en 3FN para evitar redundancia  
✅ **Integridad Referencial**: Claves foráneas con restricciones  
✅ **Auditoría**: Registro de cambios con timestamps  
✅ **Seguridad**: Contraseñas encriptadas  
✅ **Escalabilidad**: Diseño preparado para crecimiento  
✅ **JSON Support**: Almacenamiento flexible para arrays de datos  

### 🔒 Índices y Optimización

- Índices en claves primarias y foráneas
- Índice UNIQUE en email de usuarios
- Índices en campos de estado para filtrado rápido
- Timestamps automáticos para auditoría

---

## 🚀 Uso del Sistema

### Iniciar el servidor

```bash
node server.js
```

O con npm:

```bash
npm start
```

### Acceder a la aplicación

Abre tu navegador en:
```
http://localhost:3000
```

### Páginas Disponibles

| Página | Ruta | Descripción |
|--------|------|-------------|
| 🏠 **Inicio** | `/index.html` | Página principal |
| 🔐 **Login** | `/login.html` | Autenticación de usuarios |
| 📝 **Registro** | `/registro.html` | Crear nueva cuenta |
| 🚨 **Reportar** | `/reportar.html` | Denunciar maltrato animal |
| 🐕 **Animales** | `/animales.html` | Ver animales disponibles |
| 👨‍💼 **Admin** | `/admin.html` | Panel administrativo |
| 🏥 **Veterinario** | `/veterinario.html` | Gestión médica |

---

## 📊 Resultados Esperados

### 1. Sistema Completamente Funcional
Sistema de gestión automatizado capaz de ejecutar procesos de registro, actualización y consulta sin intervención manual constante, reduciendo tiempos y mejorando la eficiencia operativa.

### 2. Interfaz de Usuario Intuitiva
Plataforma accesible que permita a usuarios de diferentes niveles técnicos cargar información, gestionar casos y visualizar el progreso de forma sencilla.

### 3. Mejora en Precisión y Consistencia
Gracias a un flujo de trabajo estandarizado y reproducible que optimiza el manejo de la información y reduce errores.

### 4. Reducción de Errores
Minimización significativa de errores derivados de la gestión manual, garantizando que el sistema se mantenga actualizado y alineado con las necesidades de protección animal.

### 5. Validación Satisfactoria
Demostración de estabilidad, facilidad de uso y utilidad en escenarios simulados que reflejen operaciones reales.

---


## 📄 Licencia

Este proyecto fue desarrollado como parte del programa académico del **Instituto Tecnológico de Tijuana** con fines educativos y de impacto social.

---

## 📞 Contacto

**Desarrollador**: Martinez Lozano Pedro Damian - 23212806-debug  
**Institución**: Instituto Tecnológico de Tijuana  
**Departamento**: Ingeniería Eléctrica y Electrónica  
**Repositorio**: [https://github.com/23212806-debug/sistema_animal_code](https://github.com/23212806-debug/sistema_animal_code)

---

<div align="center">

### ⭐ Sistema de Gestión de Maltrato Animal y Adopción Responsable

**Tecnología al Servicio del Bienestar Animal**

*Desarrollado con 💚 en el Instituto Tecnológico de Tijuana*

</div>
