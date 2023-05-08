![Img](./img/socialnetwork.jpg)

# Social Network API 🫂

En este proyecto encontramos una base de datos no relacional que simula una red social. Los datos que almacenamos dentro de esta base de datos son:

- Usuarios.
- Post.
- Comentarios.
- Implementación de likes.
- Implementación de followers.

---

## Comenzando 🚀

Para poder desplegar el proyecto correctamente, desde GitHub y con el acceso correspondiente al repositorio de la web, clonar el repositorio en su ordenador, también deberá instalar todas las herramientas, frameworks, y los middlewares para el funcionamiento correcto.

---

## Ejecutando Node 🕹

Node es un entorno de ejecución de JavaScript orientado a eventos asíncronos. Node.js está diseñado para crear aplicaciones network escalables.

- Node.js es un entorno de servidor de código abierto.
- Node.js es gratis.
- Node.js se ejecuta en varias plataformas (Windows, Linux, Unix, Mac OS X, etc.)
- Node.js usa JavaScript en el servidor.

Lo descargamos del siguiente enlace [_NODE_](https://nodejs.org/es/).

---

## Instalación Nodemon 🛠

Nodemon es una herramienta que ayuda a desarrollar aplicaciones basadas en node.js al reiniciar automáticamente la aplicación cuando se detectan cambios en los archivos del directorio.

```
npm install -D nodemon.
```

---

## Ejecutando Express 🔌

Un framework como Express, es un patrón o esquema que ayuda a la programación a estructurar el código y a ahorrar tiempo y
esfuerzos a los programadores. Express.js es un framework de Node.js y permite crear una API robusta rápido y fácil.

```
npm install express
```

---

## Instalando Postman 📮

Postman es una herramienta que sirve de gran ayuda al equipo de desarrollo, permitiendo mantener las colecciones actualizadas, ahorrando los tiempos de respuesta al momento de realizar los test o las llamadas a los servicios.

Postman sirve para múltiples tareas dentro de las cuales destacaremos en esta oportunidad las siguientes:

- Testear colecciones o catálogos de APIs tanto para Frontend como para Backend.
- Organizar en carpetas, funcionalidades y módulos los servicios web.
- Permite gestionar el ciclo de vida (conceptualización y definición, desarrollo, monitoreo y mantenimiento) de nuestra API.
- Generar documentación de nuestras APIs.
- Trabajar con entornos (calidad, desarrollo, producción) y de este modo es posible compartir a través de un entorno cloud la información con el resto del equipo involucrado en el desarrollo.

Lo descargamos del siguiente enlace [_POSTMAN_](https://www.postman.com/downloads/).

---

## Ejecutando Mongoose 🐀

Mongoose es un O.D.M (Object Document Modeling) para MongoDB en NodeJs con el que podemos crear Schemas para tipado de datos, esquematizar, validar, entre otras cosas.

```
npm install express mongoose
```

---

## Ejecutando Swagger 📋

Swagger es una herramienta de software que se utiliza para diseñar, construir, documentar y probar tu API.

```
npm i swagger-ui-express
```

---

## Levantar el servidor 🎬

Normalmente el servidor lo levantamos con el comando (con nodemon):

```
npm run dev
```

Si tu ordenador crea conflicto de autorizaciones a la hora de ejecutar ciertos endpoints (ej. create con nodemailer), ejecuta el siguiente comando:

```
NODE_TLS_REJECT_UNAUTHORIZED='0' npm run dev
```

---

## BCRYPT (Encriptación de contraseñas) 💳

- HASH

Una función criptográfica hash- usualmente conocida como “hash”- es un algoritmo matemático que transforma cualquier
bloque arbitrario de datos en una nueva serie de caracteres con una longitud fija.

- SALT

Un salt es una string aleatoria. Al encriptar una contraseña de texto sin formato más un salt, la salida del
algoritmo hash ya no es predecible. La misma contraseña ya no producirá el mismo hash.

```
npm i bcryptjs
```

> Ejemplo de importación del módulo bcrypt:

```js
const { User, Post } = require("../models/index.js");
const bcrypt = require("bcryptjs");
const UserController = {
  create(req, res) {
    req.body.role = "user";
    const password = bcrypt.hashSync(req.body.password, 10);
    User.create({ ...req.body, password: password })
      .then((user) =>
        res.status(201).send({ message: "Usuario creado con éxito", user })
      )
      .catch((err) => console.error(err));
  },
};
```

> Creando ejemplo de login de la siguiente forma con bcrypt:

```js
const UserController = {
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (!user) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      res.send(user);
    });
  },
};
```

---

## JWT JSON Web Token 🗿

JWT se crea con una clave secreta y esa clave secreta es privada para ti (tu servidor), lo que significa que nunca se revelará al público ni se inyectará dentro del token JWT. Cuando recibe un JWT del cliente, puede verificar ese JWT con esta clave secreta almacenada en el servidor.

```
npm i jsonwebtoken
```

> Ejemplo de generar e importar el modelo Token:

```js
const { User, Post } = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const UserController = {
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (!user) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      let token = jwt.sign({ id: user.id }, jwt_secret);
      Token.create({ token, UserId: user.id });
      res.send({ message: "Bienvenid@" + user.name, user, token });
    });
  },
};
```

## Authentication middleware 🧑‍💻

- Tenemos definida una ruta a la cual solo usuarios logeados pueden entrar, por lo tanto, se necesita comprobar antes de entrar a esa ruta, si el usuario está o no logeado.

- Creamos una carpeta middleware y dentro de ella un archivo que se llame authentication.js que contendrá el siguiente código:

> Middleware de autenticación:

```js
const { User, Token, Sequelize } = require("../models");
const { Op } = Sequelize;
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findByPk(payload.id);
    const tokenFound = await Token.findOne({
      where: {
        [Op.and]: [{ UserId: user.id }, { token: token }],
      },
    });
    if (!tokenFound) {
      return res.status(401).send({ message: "No estas autorizado" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error, message: "Ha habido un problema con el token" });
  }
};
module.exports = { authentication };
```

> Ejemplo de implementación:

```js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");
router.post("/", UserController.create);
router.get("/", authentication, UserController.getAll);
router.delete("/:id", authentication, UserController.delete);
router.put("/:id", authentication, UserController.update);
router.post("/login", UserController.login);
module.exports = router;
```
---

## isAdmin Middleware 👨‍✈️

- Tenemos definida una ruta a la cual solo usuarios administradores pueden ingresar, por lo tanto, se necesita comprobar antes de entrar a esa ruta, si el usuario es o no, un administrador.

- Ahora crearemos un middleware que chequeara el rol del usuario para saber si es admin, lo añadimos al código de autentication:

> Middleware de admin:

```js
const isAdmin = async (req, res, next) => {
  const admins = ["admin", "superadmin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({
      message: "No tienes permisos",
    });
  }
  next();
};
module.exports = { authentication, isAdmin };
```
---

## Nodemailer 📬

- Nodemailer es un módulo para aplicaciones Node.js que permite enviar correos electrónicos de forma sencilla. Para instalarlo ejecutamos el siguiente comando:

```
npm install nodemailer
```

- Creamos un archivo nodemailer.js en la carpeta config donde se guardará la siguiente configuración:

> Ejemplo de nodemailer:

```js
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tuemail@gmail.com",
    pass: "123456",
  },
});
module.exports = transporter;
```

> Ejemplo para importar el módulo nodemailer:

```js
const transporter = require("../config/nodemailer");
. . .
async create(req, res, next) {
    try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({
        ...req.body,
        password: hash,
        confirmed: false,
        rol: "user",
    });
await transporter.sendMail({
    to: req.body.email,
    subject: "Confirme su registro",
    html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
    <a href="#"> Click para confirmar tu registro</a>
    `,
});
res.status(201).send({
    message: "Te hemos enviado un correo para confirmar el registro",
    user,
});
} catch (err) {
    err.origin = “User”;
    next(err)
}
},
```



> Enpoint confirmación de usuario:

```js
async confirm(req,res){
    try {
        await User.update({confirmed:true},{
            where:{
            email: req.params.email
        }
    })
res.status(201).send( "Usuario confirmado con éxito" );
    } catch (error) {
        console.error(error)
    }
},
```
---

## Middleware errors ❌

- Ahora vamos a crear un middleware que nos va a permitir controlar los errores a la hora de crear un elemento nuevo.

- Vamos a introducir cambios en la parte del manejo del error en el controlador UserController (catch), para ello necesitamos utilizar el parámetro “next” y pasarle el error que tenemos capturado. También vamos a modificar el error añadiendo una nueva propiedad “origin”.

> Actualización del controlador:

```js
async create(req, res,next) {
    try {
        req.body.role = "user";
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ ...req.body, password });
        res.send(user);
    } catch (error) {
        console.error(error)
        next(error)
    }
},
```

- En la carpeta “middlewares” creamos un archivo llamado “errors.js”.

> Middleware de errores:

```js
const handleValidationError = (err, res) => {
  let errors = err.errors.map((el) => el.message);
  if (errors.length > 1) {
    const msgErr = errors.join(" || ");
    res.status(400).send({ messages: msgErr });
  } else {
    res.status(400).send({ messages: errors });
  }
};
const typeError = (err, req, res, next) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    handleValidationError(err, res);
  } else {
    res.status(500).send({ msg: "Hubo un problema", err });
  }
};
module.exports = { typeError };
```
---

## Multer 🌄

Multer es un middleware para Express y Node. js que hace que sea fácil manipular este multipart/form-data cuando tus usuarios suben archivos.

```
npm i multer
```

- En la carpeta “middlewares” creamos un archivo llamado “multer.js” (Además crearemos carpeta Uploads para que las img se almacenen).

> Middleware multer:

```js
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
```

- En las rutas importamos el middleware multer.

> Importamos multer a las rutas:

```js
const upload = require("../middlewares/multer");
```

- Añadimos multer a las rutas de endpoints (ejemplos para create y update).

> Importamos multer a las rutas de los endpoints con:

```js
upload.single("img");
```

```js
router.post("/create", authentication, upload.single("img"), PostController.create);
router.put("/update/:_id", authentication, isAuthor, upload.single("img"), PostController.update);
```
---

## Construido con ⚙️

_Menciona las herramientas que utilizaste para crear tu proyecto_

- [_VISUAL STUDIO CODE_](https://code.visualstudio.com/) - Code editor used (Version: 1.75.1)
- [_Live Server_](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - Manejador de dependencias
- [_GitHub_](https://github.com/) - Almacenamiento de repositorios
- [_NODE_](https://nodejs.org/es/) - Entorno de ejecución de JavaScript en el servidor
- [_POSTMAN_](https://www.postman.com/) - Herramienta para testear las API
- [_Mongo DB_](https://www.mongodb.com/) - Herramienta para crear y gestionar bases de datos NoSQL orientada a documentos
- [_Mongo Atlas_](https://www.mongodb.com/atlas/database) - MongoDB Atlas es una DaaS (Base de datos como servicio) de MongoDB
- [_Swagger_](https://swagger.io/) - Herramienta para diseñar, construir, documentar y probar tu API.

---

## Autores ✒️

- **Guillermo Soler Fernández** - _Proyecto API Backend - Mongoose-Node-Express_ - [GuilleSoler87](https://github.com/GuilleSoler87)
- **Ismael Cervera Zamora** - _Proyecto API Backend - Mongoose-Node-Express_ - [amsiceza](https://github.com/amsiceza)

---

## Contribuir con una ⭐

Si deseas contribuir a este proyecto, no dudes en darle una estrella.

---

## Licencia 📄

Este proyecto actualmente no tiene licencia. Puede usarse todo su contenido sin el requisito de la misma.
