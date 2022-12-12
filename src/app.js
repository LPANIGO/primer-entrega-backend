import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const server = app.listen(8080, () => console.log("Listening on 8080"));


app.use(express.json()); //configuro para recibir json del front.


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
//validar params recibidos en cada ruta, procesar de string a int por ej.
//para ids validar out of bounds error.

app.use( (req, res, next) => {
    res.status(404).send({ error : "404", description: `path '${req.path}' method '${req.method}' not implemented`})
    next();//permite ir a lo que sigue
})