import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';


class Products {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const fileData = await fs.promises.readFile(this.path, 'utf-8');
                let productos = JSON.parse(fileData);
                return productos;
            } else {
                console.log("no hay archivo");
                return [];
            }
        } catch (error) {
            console.log("No se puede leer: " + error);
        }
    }

    add = async (object) => {
        try {
            let products = await this.getAll();
            if (products.length === 0) {
                object.id = 1;
                object.timestamp = Date.now();
                object.code = uuidv4();
                products.push(object);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            } else {
                //object.id = products[products.length-1].id+1;
                let products = await this.getAll();
                object.id = parseInt(products[products.length-1].id) + 1;
                object.timestamp = Date.now();
                object.code = uuidv4();
                console.log(object);
                products.push(object);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }
            
            return object;
        } catch (error) {
            console.log(`No se pudo guardar el producto... ${error}`);
        }
    }

    getById = async (productId) => {
        try {
            let products = await this.getAll();
            let product = {};
            for(let p of products) {
                if(productId === p.id) {
                    product = JSON.stringify(p);
                }
            }
            return product;
        } catch(error) {
            console.log("No se pudo encontrar el producto: " + error)
        }
    }

    update = async (id, object) => {
        try {
            let products = await this.getAll();
            object.id = parseInt(id);
            object.timestamp = new Date.now();
            let elemIndex = products.findIndex((element => element.id === parseInt(id)));
            console.log(elemIndex);
            if(elemIndex > -1) {
                products[elemIndex] = object;
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return object;
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    checkAndReduceStock = async (pid, pQuantity) => {
        try {
            let productsArray = await this.getAll();
            let pIndex = productsArray.findIndex(e => parseInt(e.id) === parseInt(pid));
            console.log(pIndex)
            if (pIndex < 0) return {message:"El id de producto no existe"};
            
            if (productsArray[pIndex].stock >= parseInt(pQuantity) ) {
                productsArray[pIndex].stock -= parseInt(pQuantity)
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray, null, '\t'));
                return true
            } else {
                return false
            }
        } catch (error) {
            return error
        }
    } 

    populateProducts = async (cartProducts) => {
        try {
            let populatedProducts = [];
            let productsArray = await this.getAll();
            
            for ( let i = 0; i < cartProducts.length; i++) {
                let pIndex = productsArray.findIndex(e => parseInt(e.id) === parseInt(cartProducts[i].product));
                populatedProducts.push({product:productsArray[pIndex], quantity: cartProducts[i].quantity });
            };
            return populatedProducts;
        } catch (error) {
            return error;
        }
        
    }

    deleteById = async (id) => {
        try {
            let products = await this.getAll();
            let newArray = products.filter(element => element.id !== id);
            console.log(products);
            console.log(newArray);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, '\t'))
            return newArray;
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
}

export default Products;