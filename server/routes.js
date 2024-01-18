
import con from './database.js'; // Importamos la conexión a la base de datos para hacer consultas dentro de cada ruta
import express from 'express'; //importamos express para crear el router
var router = express.Router(); // Creamos el router para definir rutas y luego exportarlo al index.js

//Ruta de inicio de sesion: cuando se hace una solicitud post a '/login' se ejecuta la función 
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password

    con.query('SELECT * FROM participantes WHERE usuario = ? AND contrasena = ?', [username, password], function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            req.session.role = result[0].rol;
            req.session.nombre = result[0].nombre; // Asume que tienes una columna 'nombre' en tu tabla 'usuarios'
            req.session.userId = result[0].id; // Guarda el ID del usuario en la sesión
            console.log(req.session.userId);
            console.log(req.session.role)
            console.log(req.session.userId + " es el id del participante");
            res.send('OK');
        } else {
            res.send('Credenciales incorrectas');
        }
    });
});

router.get('/rol', function(req, res) {
    if (req.session.role) {
        res.send(req.session.role) // Envía el rol del usuario
    } else {
        res.status(401).send('No autorizado')
    }
});

router.get('/nombre', function(req, res) {
    if (req.session.nombre) {
        res.send(req.session.nombre) // Envía el nombre del usuario

    } else {
        res.status(401).send('No autorizado')
    }
});

router.get('/id', function(req, res) {
    if (req.session.userId) {
        res.send(req.session.userId.toString()) // Envía el ID del usuario
    } else {
        res.status(401).send('No autorizado')
    }
});

router.post('/crear-sesion', function(req, res) {
    var nombreSesion = req.body.nombreSesion;
    var fechaHora = new Date();
    fechaHora.setHours(fechaHora.getHours() + 1); // Ajusta la hora a tu zona horaria
    fechaHora = fechaHora.toISOString();
  
    con.query('INSERT INTO sesiones (nombre, fecha) VALUES (?, ?)', [nombreSesion, fechaHora], function(err, result) {
      if (err) throw err;
      res.send({ message: 'Sesión creada con éxito', sessionId: result.insertId }); // Devuelve el ID de la sesión recién creada
    });
  });

  router.post('/crear-tarea', (req, res) => {
    const { nombre, estimacion, sesionId } = req.body;
    const query = `INSERT INTO tareas (nombre, estimacion, sesion) VALUES (?, ?, ?)`;
    con.query(query, [nombre, estimacion, sesionId], (err, result) => {
      if (err) {
        res.status(500).send('Error al crear la tarea');
      } else {
        // Devuelve el id de la tarea recién creada
        res.status(200).json({ message: 'Tarea creada con éxito', tareaId: result.insertId });
      }
    });
  });

  router.get('/sesiones', function(req, res) {
    con.query('SELECT * FROM sesiones', function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.delete('/sesiones/:id', function(req, res) {
    var id = req.params.id;
  
    // Primero, elimina todas las tareas que hacen referencia a la sesión
    con.query('DELETE FROM tareas WHERE sesion = ?', [id], function(err, result) {
        if (err) throw err;

        // Luego, elimina la sesión
        con.query('DELETE FROM sesiones WHERE id = ?', [id], function(err, result) {
            if (err) throw err;
            res.send({ message: 'Sesión eliminada con éxito' });
        });
    });
});

router.get('/tareas/:id', function(req, res) {
    var id = req.params.id;
    con.query('SELECT * FROM tareas WHERE sesion = ?', [id], function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.delete('/tareas/:id', function(req, res) {
    var id = req.params.id;
  
    // Elimina la tarea
    con.query('DELETE FROM tareas WHERE id = ?', [id], function(err, result) {
        if (err) throw err;
        res.send({ message: 'Tarea eliminada con éxito' });
    });
});

  
router.post('/guardar-votacion', (req, res) => {
    const { usuarioId, tareaId, votacion } = req.body;
    const query = `INSERT INTO votaciones (id_participante, id_tarea, votacion) VALUES (?, ?, ?)`;
    con.query(query, [usuarioId, tareaId, votacion], (err, result) => {
      if (err) {
        res.status(500).send('Error al guardar la votación');
      } else {
        res.status(200).send('Votación guardada con éxito');
      }
    });
});

router.get('/votaciones/:id', function(req, res) {
    var id = req.params.id;
    con.query('SELECT participantes.nombre, votaciones.votacion FROM votaciones INNER JOIN participantes ON votaciones.id_participante = participantes.id WHERE votaciones.id_tarea = ?', [id], function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

export default router;