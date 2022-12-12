import fs from 'fs';


class Carts {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const fileData = await fs.promises.readFile(this.path, 'utf-8');
                let carts = JSON.parse(fileData);
                return carts;
            } else {
                let carts = [];
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return carts;
            }
        } catch (error) {
            console.log("No se puede leer: " + error);
        }
    }

    addCart = async () => {
        try {
            let carts = await this.getAll();
            let newCart = {};
            if (carts.length === 0) {
                newCart.id = 1;
                newCart.timestamp = Date.now();
                newCart.products = [];
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            } else {
                let carts = await this.getAll();
                newCart.id = parseInt(carts[carts.length-1].id) + 1;
                newCart.timestamp = Date.now();
                newCart.products = [];
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            }
            return newCart.id;
        } catch (error) {
            console.log(`No se pudo guardar el carrito... ${error}`);
        }
    }

    addProductById = async (cid, pid, pQuantity) => {
        try {
            let carts = await this.getAll();
            if(carts.length < 1) return console.log("El carrito no exise");
            
            let cartIndex = carts.findIndex((element => element.id === parseInt(cid)));
            if (cartIndex < 0) return console.log("ID de carrito incorrecto.");
            
            let prodExistsAt = carts[cartIndex].products.findIndex(e => e.product === parseInt(pid));
            if (prodExistsAt >= 0) {
                let lastQuantity = carts[cartIndex].products[prodExistsAt].quantity;
                let newQuantity = lastQuantity + parseInt(pQuantity);
                carts[cartIndex].products[prodExistsAt].quantity = newQuantity;
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return newQuantity;
            } else {
                let auxP = {
                    product: pid,
                    quantity: pQuantity
                }
                carts[cartIndex].products.push(auxP);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return auxP.quantity;
            }
        } catch (error) {
            console.log(`No se puedo agregar producto. ${error}`);
        }
    }

    getCartById = async (cid) => {
        try {
            const carts = await this.getAll();
            const cartFound = carts.filter(e => e.id === parseInt(cid))[0];
            const products = cartFound.products;   
            if (products.length < 1) {
                return [];
            }  
            return products;
            
        } catch(error) {
            console.log("No se pudo encontrar el carrito: " + error)
        }
    }

    deleteCartById = async (cid) => {
        try {
            let carts = await this.getAll();
            let newArray = carts.filter(element => element.id !== parseInt(cid));
            await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, '\t'))
            return newArray;
        } catch (error) {
            return error;
        }
    }
}

export default Carts;