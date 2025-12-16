const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
require('dotenv').config();

// ================= CONFIGURACIÓN =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_animal_2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ================= BASE DE DATOS =================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'pedro487',
    database: process.env.DB_NAME || 'sistema_animal'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        process.exit(1);
    }
    console.log('✅ Conectado a MySQL - sistema_animal');
});

// ================= MIDDLEWARES =================
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acceso restringido a administradores' });
    }
    next();
}
/*
function requireVeterinario(req, res, next) {
    if (!req.session.user || req.session.user.tipo !== 'veterinario') {
        return res.status(403).json({ 
            error: 'Acceso restringido a veterinarios autorizados',
            tipo_usuario: req.session.user?.tipo 
        });
    }
    next();
}
*/
// ================= RUTAS PÚBLICAS =================
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================= AUTENTICACIÓN =================
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await db.promise().query(
            'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        
        const user = users[0];
        
        // 🔥 ACCESO DIRECTO PARA ADMINISTRADORES DE PRUEBA
        if (email === 'superadmin@animal.com' || email === 'admin@animal.com') {
            console.log(`🎉 Login automático para: ${email}`);
        } else {
            // Para otros usuarios, verificar contraseña
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        }
        
        // Crear sesión
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            tipo: user.tipo
        };
        
        console.log(`✅ Login exitoso: ${user.nombre} (${user.tipo})`);
        
        res.json({ 
            success: true, 
            user: req.session.user,
            redirect: '/dashboard'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Registro de usuarios - CORREGIDO
app.post('/api/registro', async (req, res) => {
    const { nombre, email, password, telefono } = req.body;
    
    console.log('📝 Intento de registro recibido:', { nombre, email });
    
    try {
        // Verificar si el email ya existe
        const [existing] = await db.promise().query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            console.log('❌ Email ya registrado:', email);
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar usuario - SIN la columna direccion que no existe
        await db.promise().query(
            'INSERT INTO usuarios (nombre, email, password, telefono, tipo) VALUES (?, ?, ?, ?, "usuario")',
            [nombre, email, hashedPassword, telefono]
        );
        
        console.log('✅ Usuario registrado exitosamente:', email);
        
        res.json({ 
            success: true, 
            message: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.'
        });
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario: ' + error.message });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, redirect: '/login.html' });
});

// Obtener información del usuario actual
app.get('/api/user', requireLogin, (req, res) => {
    res.json({ user: req.session.user });
});

// ================= API - ADMINISTRADOR =================
app.get('/api/admin/check', requireLogin, (req, res) => {
    const isAdmin = req.session.user.tipo === 'admin';
    res.json({ isAdmin, user: req.session.user });
});

// Obtener reportes para admin
app.get('/api/admin/reportes', requireLogin, requireAdmin, async (req, res) => {
    try {
        const [reportes] = await db.promise().query(`
            SELECT r.*, u.nombre as usuario_nombre
            FROM reportes r
            JOIN usuarios u ON r.usuario_id = u.id
            ORDER BY r.fecha_reporte DESC
        `);
        
        res.json(reportes);
    } catch (error) {
        console.error('Error obteniendo reportes:', error);
        res.status(500).json({ error: 'Error obteniendo reportes' });
    }
});

// Actualizar estado de reporte
app.put('/api/admin/reportes/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const { estado, notas_admin } = req.body;
        
        await db.promise().query(
            `UPDATE reportes 
             SET estado = ?, notas_admin = ?, revisado_por = ?, fecha_revision = NOW()
             WHERE id = ?`,
            [estado, notas_admin, req.session.user.id, req.params.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando reporte' });
    }
});

// Agregar nuevo animal
app.post('/api/admin/animales', requireLogin, requireAdmin, upload.array('fotos', 5), async (req, res) => {
    try {
        const { nombre, especie, raza, edad, sexo, tamano, descripcion, salud, ubicacion } = req.body;
        
        const fotos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        const [result] = await db.promise().query(
            `INSERT INTO animales 
             (nombre, especie, raza, edad, sexo, tamano, descripcion, fotos, salud, estado, ubicacion, creado_por) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'tratamiento', ?, ?)`,
            [nombre, especie, raza, edad, sexo, tamano, descripcion, 
             JSON.stringify(fotos), salud, ubicacion, req.session.user.id]
        );
        
        res.json({ 
            success: true, 
            id: result.insertId,
            message: 'Animal registrado exitosamente'
        });
        
    } catch (error) {
        console.error('Error agregando animal:', error);
        res.status(500).json({ error: 'Error registrando animal' });
    }
});

// Obtener solicitudes de veterinarios pendientes
app.get('/api/admin/solicitudes-veterinario', requireLogin, requireAdmin, async (req, res) => {
    try {
        const [solicitudes] = await db.promise().query(`
            SELECT sv.*, u.nombre, u.email, u.telefono
            FROM solicitudes_veterinario sv
            JOIN usuarios u ON sv.usuario_id = u.id
            WHERE sv.estado = 'pendiente'
            ORDER BY sv.fecha_solicitud DESC
        `);
        
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo solicitudes' });
    }
});

// Aprobar/rechazar veterinario
app.put('/api/admin/solicitudes-veterinario/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        
        // Actualizar solicitud
        await db.promise().query(
            `UPDATE solicitudes_veterinario 
             SET estado = ?, revisado_por = ?, fecha_resolucion = NOW()
             WHERE id = ?`,
            [estado, req.session.user.id, req.params.id]
        );
        
        // Si se aprueba, actualizar tipo del usuario
        if (estado === 'aprobada') {
            const [solicitud] = await db.promise().query(
                'SELECT usuario_id FROM solicitudes_veterinario WHERE id = ?',
                [req.params.id]
            );
            
            if (solicitud.length > 0) {
                await db.promise().query(
                    'UPDATE usuarios SET tipo = "veterinario" WHERE id = ?',
                    [solicitud[0].usuario_id]
                );
            }
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando solicitud' });
    }
});

// Obtener adopciones pendientes
app.get('/api/admin/adopciones', requireLogin, requireAdmin, async (req, res) => {
    try {
        const [adopciones] = await db.promise().query(`
            SELECT a.*, u.nombre as usuario_nombre, an.nombre as animal_nombre,
                   an.especie, an.fotos
            FROM adopciones a
            JOIN usuarios u ON a.usuario_id = u.id
            JOIN animales an ON a.animal_id = an.id
            WHERE a.estado = 'pendiente'
            ORDER BY a.fecha_solicitud DESC
        `);
        
        res.json(adopciones);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo adopciones' });
    }
});

// Aprobar/rechazar adopción
app.put('/api/admin/adopciones/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        
        await db.promise().query(
            `UPDATE adopciones 
             SET estado = ?, revisado_por = ?, fecha_resolucion = NOW()
             WHERE id = ?`,
            [estado, req.session.user.id, req.params.id]
        );
        
        // Si se aprueba, marcar animal como adoptado
        if (estado === 'aprobada') {
            const [adopcion] = await db.promise().query(
                'SELECT animal_id FROM adopciones WHERE id = ?',
                [req.params.id]
            );
            
            if (adopcion.length > 0) {
                await db.promise().query(
                    'UPDATE animales SET estado = "adoptado" WHERE id = ?',
                    [adopcion[0].animal_id]
                );
            }
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando adopción' });
    }
});

// ================= API - USUARIOS =================
// Obtener animales disponibles - VERSIÓN MEJORADA
app.get('/api/animales', async (req, res) => {
    try {
        const { especie, estado, tamano, sexo } = req.query;
        let query = `SELECT * FROM animales WHERE 1=1`;
        const params = [];
        
        if (especie) {
            query += ' AND especie = ?';
            params.push(especie);
        }
        
        if (estado) {
            query += ' AND estado = ?';
            params.push(estado);
        }
        
        if (tamano) {
            query += ' AND tamano = ?';
            params.push(tamano);
        }
        
        if (sexo) {
            query += ' AND sexo = ?';
            params.push(sexo);
        }
        
        query += ' ORDER BY creado_en DESC LIMIT 50';
        
        const [animales] = await db.promise().query(query, params);
        
        // MANEJO SEGURO DE FOTOS - MEJORADO
        const animalesConFotos = animales.map(animal => {
            let fotosArray = [];
            
            if (animal.fotos) {
                try {
                    // Si empieza con [ o {, intentar parsear como JSON
                    const fotosStr = animal.fotos.trim();
                    if (fotosStr.startsWith('[') || fotosStr.startsWith('{')) {
                        fotosArray = JSON.parse(fotosStr);
                    } else {
                        // Si es una URL simple, ponerla en un array
                        fotosArray = [fotosStr];
                    }
                    
                    // Asegurarse de que sea un array
                    if (!Array.isArray(fotosArray)) {
                        fotosArray = [fotosArray];
                    }
                } catch (error) {
                    console.warn(`⚠️ Error parseando fotos para animal ${animal.id}:`, animal.fotos);
                    // Si falla, asumir que es una URL string
                    fotosArray = [animal.fotos];
                }
            }
            
            return {
                ...animal,
                fotos: fotosArray
            };
        });
        
        res.json(animalesConFotos);
        
    } catch (error) {
        console.error('❌ Error obteniendo animales:', error);
        res.status(500).json({ error: 'Error obteniendo animales: ' + error.message });
    }
});

// Crear reporte
app.post('/api/reportes', requireLogin, upload.array('fotos', 5), async (req, res) => {
    try {
        const { titulo, descripcion, tipo, ubicacion } = req.body;
        
        const fotos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        await db.promise().query(
            `INSERT INTO reportes (usuario_id, titulo, descripcion, tipo_reporte, ubicacion, fotos) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.session.user.id, titulo, descripcion, tipo, ubicacion, JSON.stringify(fotos)]
        );
        
        res.json({ success: true, message: 'Reporte enviado exitosamente' });
    } catch (error) {
        console.error('Error creando reporte:', error);
        res.status(500).json({ error: 'Error creando reporte' });
    }
});

// Solicitar ser veterinario
app.post('/api/solicitar-veterinario', requireLogin, async (req, res) => {
    try {
        const { experiencia, especialidad } = req.body;
        
        await db.promise().query(
            `INSERT INTO solicitudes_veterinario (usuario_id, experiencia, especialidad) 
             VALUES (?, ?, ?)`,
            [req.session.user.id, experiencia, especialidad]
        );
        
        res.json({ 
            success: true, 
            message: 'Solicitud enviada. Un administrador la revisará pronto.' 
        });
    } catch (error) {
        console.error('Error enviando solicitud:', error);
        res.status(500).json({ error: 'Error enviando solicitud' });
    }
});

// Solicitar adopción
app.post('/api/adopciones', requireLogin, async (req, res) => {
    try {
        const { animal_id, motivo, vivienda, tiene_otros_animales } = req.body;
        
        await db.promise().query(
            `INSERT INTO adopciones (usuario_id, animal_id, motivo, vivienda, tiene_otros_animales) 
             VALUES (?, ?, ?, ?, ?)`,
            [req.session.user.id, animal_id, motivo, vivienda, tiene_otros_animales]
        );
        
        // Cambiar estado del animal a "reservado"
        await db.promise().query(
            'UPDATE animales SET estado = "reservado" WHERE id = ?',
            [animal_id]
        );
        
        res.json({ 
            success: true, 
            message: 'Solicitud de adopción enviada. Un administrador la revisará.' 
        });
    } catch (error) {
        console.error('Error enviando adopción:', error);
        res.status(500).json({ error: 'Error enviando solicitud de adopción' });
    }
});

// ================= ESTADÍSTICAS =================
app.get('/api/estadisticas', requireLogin, async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as total FROM animales',
            'SELECT COUNT(*) as disponibles FROM animales WHERE estado = "disponible"',
            'SELECT COUNT(*) as adoptados FROM animales WHERE estado = "adoptado"',
            'SELECT COUNT(*) as reportes FROM reportes WHERE estado = "pendiente"',
            'SELECT COUNT(*) as adopciones FROM adopciones WHERE estado = "pendiente"',
            'SELECT COUNT(*) as veterinarios FROM solicitudes_veterinario WHERE estado = "pendiente"'
        ];
        
        const results = await Promise.all(
            queries.map(q => db.promise().query(q).then(([rows]) => rows[0]))
        );
        
        res.json({
            total_animales: results[0].total,
            animales_disponibles: results[1].disponibles,
            animales_adoptados: results[2].adoptados,
            reportes_pendientes: results[3].reportes,
            adopciones_pendientes: results[4].adopciones,
            veterinarios_pendientes: results[5].veterinarios
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.json({
            total_animales: 0,
            animales_disponibles: 0,
            animales_adoptados: 0,
            reportes_pendientes: 0,
            adopciones_pendientes: 0,
            veterinarios_pendientes: 0
        });
    }
});

// ================= VETERINARIO =================

// 1. Obtener animales para veterinario
app.get('/api/veterinario/animales', requireLogin, async (req, res) => {
    try {
        // Verificar manualmente que sea veterinario
        if (req.session.user.tipo !== 'veterinario') {
            return res.status(403).json({ error: 'Acceso restringido a veterinarios' });
        }
        
        const { estado } = req.query;
        let query = `
            SELECT a.*, u.nombre as veterinario_nombre
            FROM animales a
            LEFT JOIN usuarios u ON a.veterinario_id = u.id
            WHERE 1=1
        `;
        const params = [];
        
        if (estado) {
            query += ' AND a.estado = ?';
            params.push(estado);
        }
        
        query += ` ORDER BY 
            CASE a.estado 
                WHEN 'tratamiento' THEN 1
                WHEN 'disponible' THEN 2
                WHEN 'reservado' THEN 3
                ELSE 4
            END, a.creado_en DESC LIMIT 50`;
        
        console.log('📋 Ejecutando query:', query);
        console.log('📋 Parámetros:', params);
        
        const [animales] = await db.promise().query(query, params);
        
        console.log(`📋 ${animales.length} animales encontrados`);
        
        // Asegúrate de que siempre devuelvas un array
        if (!Array.isArray(animales)) {
            console.error('❌ animales no es array:', animales);
            return res.json([]);
        }
        
        // Manejo seguro de fotos
        const animalesConFotos = animales.map(animal => {
            let fotosArray = [];
            
            if (animal.fotos) {
                try {
                    const fotosStr = animal.fotos ? animal.fotos.toString().trim() : '';
                    if (fotosStr.startsWith('[') || fotosStr.startsWith('{')) {
                        fotosArray = JSON.parse(fotosStr);
                    } else if (fotosStr) {
                        fotosArray = [fotosStr];
                    }
                    
                    if (!Array.isArray(fotosArray)) {
                        fotosArray = [fotosArray];
                    }
                } catch (error) {
                    console.warn('Error parseando fotos:', error);
                    fotosArray = animal.fotos ? [animal.fotos] : [];
                }
            }
            
            return {
                ...animal,
                fotos: fotosArray,
                veterinario_asignado: animal.veterinario_nombre || 'Sin asignar'
            };
        });
        
        res.json(animalesConFotos);
        
    } catch (error) {
        console.error('❌ Error obteniendo animales:', error);
        // Devuelve array vacío en lugar de error
        res.json([]);
    }
});

// 2. Atender animal (historial médico + cambiar estado)
app.post('/api/veterinario/atender', requireLogin, async (req, res) => {
    try {
        const { 
            animal_id, 
            tipo_atencion, 
            diagnostico, 
            tratamiento, 
            medicamentos, 
            proxima_cita, 
            costo,
            nuevo_estado,
            razon_estado
        } = req.body;
        
        const veterinarioId = req.session.user.id;
        
        console.log('🏥 Veterinario atendiendo:', { animal_id, veterinarioId, nuevo_estado });
        
        // 1. Registrar en historial médico
        await db.promise().query(
            `INSERT INTO historial_medico 
             (animal_id, veterinario_id, tipo_atencion, diagnostico, tratamiento, 
              medicamentos, fecha_atencion, proxima_cita, costo, notas) 
             VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
            [animal_id, veterinarioId, tipo_atencion, diagnostico, tratamiento, 
             medicamentos || null, proxima_cita || null, costo || 0, 
             razon_estado || 'Atención veterinaria']
        );
        
        // 2. Actualizar estado del animal si se especificó
        if (nuevo_estado) {
            // Obtener estado actual
            const [animalActual] = await db.promise().query(
                'SELECT estado, nombre FROM animales WHERE id = ?',
                [animal_id]
            );
            
            const estadoAnterior = animalActual[0]?.estado || 'desconocido';
            const nombreAnimal = animalActual[0]?.nombre || 'Animal';
            
            // Actualizar animal
            await db.promise().query(
                `UPDATE animales 
                 SET estado = ?, veterinario_id = ?, actualizado_en = NOW()
                 WHERE id = ?`,
                [nuevo_estado, veterinarioId, animal_id]
            );
            
            // Registrar cambio en historial_estados
            try {
                await db.promise().query(
                    `INSERT INTO historial_estados 
                     (animal_id, usuario_id, estado_anterior, estado_nuevo, razon)
                     VALUES (?, ?, ?, ?, ?)`,
                    [animal_id, veterinarioId, estadoAnterior, nuevo_estado, 
                     `${tipo_atencion}: ${razon_estado || 'Cambio por atención médica'}`]
                );
            } catch (histError) {
                console.log('⚠️ No se pudo registrar en historial_estados:', histError.message);
            }
            
            console.log(`✅ ${nombreAnimal} - Estado: ${estadoAnterior} → ${nuevo_estado}`);
        }
        
        res.json({ 
            success: true, 
            message: '✅ Atención registrada exitosamente' + 
                    (nuevo_estado ? ` y estado cambiado a: ${nuevo_estado}` : '')
        });
        
    } catch (error) {
        console.error('❌ Error atendiendo animal:', error);
        res.status(500).json({ error: 'Error registrando atención: ' + error.message });
    }
});

// 3. Cambiar solo el estado (sin historial médico)
app.put('/api/veterinario/estado/:animalId', requireLogin, async (req, res) => {
    try {
        const { nuevo_estado, razon } = req.body;
        const animalId = req.params.animalId;
        const veterinarioId = req.session.user.id;
        
        if (!nuevo_estado) {
            return res.status(400).json({ error: 'El nuevo estado es requerido' });
        }
        
        // Estados permitidos
        const estadosPermitidos = ['disponible', 'tratamiento', 'reservado'];
        if (!estadosPermitidos.includes(nuevo_estado)) {
            return res.status(400).json({ 
                error: 'Estado no válido', 
                estados_permitidos: estadosPermitidos 
            });
        }
        
        // Obtener estado actual
        const [animalActual] = await db.promise().query(
            'SELECT estado, nombre FROM animales WHERE id = ?',
            [animalId]
        );
        
        if (animalActual.length === 0) {
            return res.status(404).json({ error: 'Animal no encontrado' });
        }
        
        const estadoAnterior = animalActual[0].estado;
        const nombreAnimal = animalActual[0].nombre;
        
        // Actualizar estado
        await db.promise().query(
            `UPDATE animales 
             SET estado = ?, veterinario_id = ?, actualizado_en = NOW()
             WHERE id = ?`,
            [nuevo_estado, veterinarioId, animalId]
        );
        
        // Registrar en historial_estados
        await db.promise().query(
            `INSERT INTO historial_estados 
             (animal_id, usuario_id, estado_anterior, estado_nuevo, razon)
             VALUES (?, ?, ?, ?, ?)`,
            [animalId, veterinarioId, estadoAnterior, nuevo_estado, razon || 'Cambio por veterinario']
        );
        
        console.log(`✅ Estado cambiado: ${nombreAnimal} - ${estadoAnterior} → ${nuevo_estado}`);
        
        res.json({ 
            success: true, 
            message: `Estado cambiado de "${estadoAnterior}" a "${nuevo_estado}"`,
            data: {
                animal_id: animalId,
                animal_nombre: nombreAnimal,
                estado_anterior: estadoAnterior,
                estado_nuevo: nuevo_estado,
                veterinario_id: veterinarioId
            }
        });
        
    } catch (error) {
        console.error('❌ Error cambiando estado:', error);
        res.status(500).json({ error: 'Error cambiando estado: ' + error.message });
    }
});

// 4. Obtener historial médico de un animal
app.get('/api/veterinario/historial/:animalId', requireLogin, async (req, res) => {
    try {
        const animalId = req.params.animalId;
        
        const [historial] = await db.promise().query(`
            SELECT hm.*, u.nombre as veterinario_nombre, u.email as veterinario_email
            FROM historial_medico hm
            JOIN usuarios u ON hm.veterinario_id = u.id
            WHERE hm.animal_id = ?
            ORDER BY hm.fecha_atencion DESC, hm.fecha_registro DESC
            LIMIT 20
        `, [animalId]);
        
        res.json(historial);
        
    } catch (error) {
        console.error('❌ Error obteniendo historial:', error);
        res.status(500).json({ error: 'Error obteniendo historial: ' + error.message });
    }
});

// 5. Dashboard del veterinario
app.get('/api/veterinario/dashboard-stats', requireLogin, async (req, res) => {
    try {
        const veterinarioId = req.session.user.id;
        
        const queries = [
            `SELECT COUNT(*) as total FROM animales WHERE estado = 'tratamiento'`,
            `SELECT COUNT(*) as disponibles FROM animales WHERE estado = 'disponible'`,
            `SELECT COUNT(*) as historial FROM historial_medico WHERE veterinario_id = ?`,
            `SELECT COUNT(*) as asignados FROM animales WHERE veterinario_id = ?`,
            `SELECT COUNT(*) as ultima_semana FROM historial_medico WHERE veterinario_id = ? AND fecha_atencion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
        ];
        
        const results = await Promise.all(
            queries.map(q => db.promise().query(q, [veterinarioId]).then(([rows]) => rows[0]))
        );
        
        res.json({
            en_tratamiento: results[0].total,
            disponibles: results[1].disponibles,
            historial_total: results[2].historial,
            asignados: results[3].asignados,
            ultima_semana: results[4].ultima_semana,
            veterinario_nombre: req.session.user.nombre
        });
        
    } catch (error) {
        console.error('❌ Error dashboard veterinario:', error);
        res.status(500).json({ 
            en_tratamiento: 0,
            disponibles: 0,
            historial_total: 0,
            asignados: 0,
            ultima_semana: 0,
            veterinario_nombre: req.session.user.nombre
        });
    }
});

// ================= RUTAS ADICIONALES =================
// Obtener todos los usuarios (solo admin)
app.get('/api/admin/usuarios', requireLogin, requireAdmin, async (req, res) => {
    try {
        const [usuarios] = await db.promise().query(
            'SELECT id, nombre, email, telefono, tipo, fecha_registro FROM usuarios ORDER BY fecha_registro DESC'
        );
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
});

// Eliminar animal (solo admin)
app.delete('/api/admin/animales/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM animales WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando animal' });
    }
});

// Ver detalles completos de una adopción
app.get('/api/admin/adopciones/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const [adopciones] = await db.promise().query(`
            SELECT a.*, 
                   u.nombre as usuario_nombre, u.email as usuario_email, u.telefono as usuario_telefono,
                   an.nombre as animal_nombre, an.especie, an.raza, an.edad, an.sexo, an.tamano, an.descripcion as animal_descripcion
            FROM adopciones a
            JOIN usuarios u ON a.usuario_id = u.id
            JOIN animales an ON a.animal_id = an.id
            WHERE a.id = ?
        `, [req.params.id]);
        
        if (adopciones.length === 0) {
            return res.status(404).json({ error: 'Adopción no encontrada' });
        }
        
        res.json(adopciones[0]);
    } catch (error) {
        console.error('Error obteniendo detalles de adopción:', error);
        res.status(500).json({ error: 'Error obteniendo detalles' });
    }
});


// ================= INICIAR SERVIDOR =================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    const os = require('os');
    
    console.log(`╔══════════════════════════════════════════╗`);
    console.log(`║      🚀 SISTEMA ANIMAL - SERVIDOR       ║`);
    console.log(`╚══════════════════════════════════════════╝`);
    console.log(`📡 Modo: ${HOST === '0.0.0.0' ? 'RED LOCAL' : 'LOCAL'}`);
    console.log(`🔌 Puerto: ${PORT}`);
    console.log(``);
    console.log(`📍 PARA TI (en tu computadora):`);
    console.log(`   👉 http://localhost:${PORT}`);
    console.log(``);
    console.log(`📍 PARA OTROS EN TU MISMA RED WiFi:`);
    console.log(`   👉 http:// 172.16.66.217:${PORT} ← COPIA Y COMPARTE ESTA`);
    console.log(``);
    console.log(`📌 Instrucciones para otros:`);
    console.log(`   1. Conéctate al mismo WiFi`);
    console.log(`   2. Abre navegador (Chrome, Firefox, etc.)`);
    console.log(`   3. Ve a: http://192.168.1.81:3000`);
});