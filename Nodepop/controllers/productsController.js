import Product from '../models/Product.js'
import createError from 'http-errors'
import {body, validationResult} from 'express-validator'


export function index(req,res,next){
    res.render('new-product')
}


// validaciones

export const validateProduct = [
    /*
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 4 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isNumeric().withMessage('El precio debe ser un número'),

    body('image')
        .notEmpty().withMessage('La URL de la imagen es obligatoria'),

    body('tags')
        .isArray().withMessage('Las etiquetas deben ser un arreglo')
        .custom(tags => {
            const validTags = ['work', 'lifestyle', 'motor', 'mobile'];
            return tags.every(tag =>    validTags.includes(body('tags')));
            
        }).withMessage('Las etiquetas solo pueden ser: work, lifestyle, motor, mobile')

        */
        
];
export async function postNew(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errores de validación:", errors.array()); // Imprime los errores en consola

      // Renderiza el formulario nuevamente con mensajes de error
        return res.render('new-product', {
            errorMessage: errors.array().map(error => error.msg).join(', '),
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            tags: req.body.tags
        });
        }
    
        try {//prueba
            let { name, price, image, tags } = req.body;
            console.log("Etiquetas antes de la conversión:", tags);  // Agregar esta línea

            // Si 'tags' es una cadena, conviértela en un arreglo de etiquetas
            if (typeof tags === 'string') {
                tags = tags.split(',').map(tag => tag.trim());  // Separa por comas y elimina espacios extra
            }
            console.log("Etiquetas después de la conversión:", tags);  // Agregar esta línea

            // Validación de las etiquetas (verifica si las etiquetas son válidas)
            const validTags = ['work', 'lifestyle', 'motor', 'mobile'];
            const invalidTags = tags.filter(tag => !validTags.includes(tag));
    
            if (invalidTags.length > 0) {
                return res.render('new-product', {
                    errorMessage: `Las siguientes etiquetas no son válidas: ${invalidTags.join(', ')}`,
                    name,
                    price,
                    image,
                    tags
                });
            }//hasta aqui la prueba
        const product = new Product({
            name,
            price,
            image,
            tags,
            owner: req.session.userId
        });
        
        await product.save();
        res.redirect('/');
        } catch (error) {
        next(error);
    }
}


// borrar un producto 
export async function deleteProduct(req, res, next) {
    const userId = req.session.userId
    const productId = req.params.productId
    // validar que el elememnto que queremos borrar es propiedad del usuario logado'MUY IMPORTANTE 
    const product = await Product.findOne({ _id: productId})
    // verificarn que existe
    if(!product){
        console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto inexistente`)
        return next(createError(404, 'Not found'))
    }
    if (product.owner.toString() !== userId) {
        console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto de otro usuario`)
        return next(createError(401, 'Not authorized'))
    }
    await Product.deleteOne({ _id: productId})
    res.redirect('/')
}
