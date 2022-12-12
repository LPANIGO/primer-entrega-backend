import {Router} from 'express';
import ProductsService from '../manager/products.manager.js';
import CartsService from '../manager/carts.manager.js'

const router = Router();
const cartsService = new CartsService('src/files/carts.json');
const productsService = new ProductsService('src/files/products.json');


router.post('/', async (req, res) => { //creal el carrito con products vacio
    let createdCart = await cartsService.addCart();
    res.send({cartID:createdCart});
});

router.delete('/:cid', async (req, res) => { //vaciar el carrito y lo elimina
    let newArray = cartsService.deleteCartById(req.params.cid);
    res.send(newArray);
});

router.get('/:cid/products', async (req, res) => { //arreglo con productos de solo ese carrito. Al solicitar este get agarro el id, buscar si el id existe, y populate el objeto. 
    let cartProducts = await cartsService.getCartById(req.params.cid);
    if (cartProducts.length < 1) return res.status(400).send({message:"El carrito está vacio o no está creado."})
    let populatedProducts = await productsService.populateProducts(cartProducts);
    res.send(populatedProducts);
});

router.post('/:cid/products', async (req, res) => { //incorporar el producto a partir del id de producto
    let stockControl = await productsService.checkAndReduceStock(req.body.pid, req.body.pQuantity); //true or false
    console.log(stockControl);
    if (stockControl === true) {
        //el stock es suficiente y fue reducido.
        let addedProduct = await cartsService.addProductById(req.params.cid, req.body.pid, req.body.pQuantity)
        return res.send({totalQuantity:addedProduct});
    } else if (stockControl === false) {
        return res.status(400).send({message:"Stock insuficiente para el pedido."})
    }
        //el id no existe o hubo un error
    res.send(stockControl)
});

router.delete('/:cid/products/:pid', async (req, res) => { //elimina un producto por id de cart y product

});

export default router;