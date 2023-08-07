# Explicación

Este proyecto es un API básica que sigue las consignas de la tercera preEntrega del proyecto final de CoderHouse funcionando con MongoDB y hay views hechas con handlebars. Ahora el usuario es capaz de crear un ticket para terminar su compra, puede ver su carrito, el chat y puede ver su perfil.

### `npm start`

Inicia el Servidor en [http://localhost:8080]


### Link de postman (donde estan se encuentran los endpoints del API)

[https://documenter.getpostman.com/view/27127572/2s93eYTrfS]

## Views de HandleBars

/auth/register para registrarse en la DB

/auth/login para iniciar sesion

/api/sessions/current para ver tu sesion

/products es una vista de los productos con paginacion que puede recibir por query de la url: limit, sort, category y page; y tiene acceso a otras funcionalidades que puede hacer el usuario

/cart/:cid donde le pones el id del carrito y se renderizan los que tiene

/realtimeproducts para poder agregar

/chat para el chat

## Dependencias

Este proyecto utiliza las dependencias de Express para hacer un servidor local, Multer para la subida de imagenes a la carpeta public y uuid para la creación de ids de productos y carritos.

Documentación de las Dependecias:
1. Express: [https://expressjs.com/es/]
2. Multer: [https://github.com/expressjs/multer#readme]
3. uuid: [https://github.com/uuidjs/uuid#readme]
4. socket.io: [https://socket.io/docs/v4/]
5. express-handlebars: [https://www.npmjs.com/package/express-handlebars]
6. Mongoose: [https://mongoosejs.com]
7. mongoose-paginate-v2: [https://github.com/aravindnc/mongoose-paginate-v2]
8. express-session: [https://github.com/expressjs/session]
9. connect-mongo: [https://www.npmjs.com/package/connect-mongo]
10. passport[https://www.passportjs.org]