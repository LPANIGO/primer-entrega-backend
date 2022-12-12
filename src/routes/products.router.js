import {Router} from 'express';
import ProductsService from '../manager/products.manager.js';

const router = Router();
const productsService = new ProductsService('src/files/products.json');
const admin = true;

let pModel = [
    {   id:1,
        timestamp:465465464,
        name:"name",
        description:"asdfsag",
        code: '3edf34we3s', //validar que no se repita
        thumnail: "img",
        price: 2000,
        stock: 35
    }
]

const authenticationMiddleware = (req,res,next) => {
    if(admin === false) return res.status(401).send({error:"Not authorized"})
    next(); //permite ir a lo que sigue
}

router.get('/', async (req, res) => {
    let productsArray = await productsService.getAll();
    if (Object.keys(productsArray).length === 0) return res.status(404).send("No hay Productos");
    res.send(productsArray);
});

router.get('/:pid', async (req, res) => {
    if (isNaN(req.params.pid)) return res.status(400).send({status:"error",error:"El valor debe ser numérico."});
    if (parseInt(req.params.pid)<1 ) return res.status(400).send({status:"error",error:"ID out of boundary."}); //|| parseInt(req.params.pid) > products.length
    let product = await productsService.getById(parseInt(req.params.pid));
    if (Object.keys(product).length === 0) return res.status(400).send("No hay producto con ese numero de ID");
    res.send(product);
});

router.post('/', authenticationMiddleware, async (req, res) => { //ADMIN middleware Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }
    let newProduct = req.body; //recibe un json parseado
    let addedProduct = await productsService.add(newProduct);
    res.send({status:"success",theChosenOne:addedProduct});
});

router.put('/:pid', authenticationMiddleware, async (req, res) => { //ADMIN middleware
    if (isNaN(req.params.pid)) return res.status(400).send({error:"El parámetro debe ser numérico."});
    if (parseInt(req.params.pid) < 1 ) return res.status(400).send("El ID debe ser mayor que 0"); //|| parseInt(req.params.id) > arrayProducts.length
    let updatedP = req.body;
    // console.log(updatedP)
    let updated = await productsService.update( req.params.pid, updatedP );
    res.send({status:"success",change:updated})
});

router.delete('/:pid', authenticationMiddleware, async (req, res) => {  //ADMIN middleware
    if (isNaN(req.params.pid)) return res.status(400).send({error:"El parámetro debe ser numérico."});
    if (parseInt(req.params.pid) < 1 ) return res.status(400).send("El ID debe ser mayor que 0");
    let newArray = await productsService.deleteById(parseInt(req.params.pid));
    res.send(newArray);
});

export default router;