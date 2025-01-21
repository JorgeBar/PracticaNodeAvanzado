import readline from 'node:readline'
import connectMongoose from "./lib/connectMongoose.js";
import User from './models/User.js'
import Product from './models/Product.js';

const connection = await connectMongoose()
console.log('Connected to MongodDB:', connection.name)

const questionResponse = await ask('Are you sure you want to empty the database and create initial data?')
if(questionResponse.toLowerCase() !== 'yes'){
    console.log('Operation aborted.')
    process.exit()
}
await initUsers()
await initProducts()

connection.close()

async function initProducts() {
    // delete all products
    const deleteResult = await Product.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} products.`);

    //esta promesa hace que me reconozca los owner
    const [admin, user1] = await Promise.all([
        User.findOne({ email: 'admin@example.com' }),
        User.findOne({ email: 'user1@example.com' }),
    ]);

    // create initial products
    const insertResult = await Product.insertMany([
        {
            name: 'television', 
            price: 420, 
            owner: admin._id, 
            image: '/assets/tvretro.jpg', // URL de ejemplo
            tags: ["lifestyle"]
        },
        {
            name: 'radio', 
            price: 52.50, 
            owner: user1._id, 
            image: '/assets/radio.jpg', // URL de ejemplo
            tags: ["work"]
        },
        {
            name: 'portatil', 
            price: 1900.70, 
            owner: user1._id, 
            image: '/assets/portatil.jpg', // URL de ejemplo
            tags: ["motor", "mobile"]
        }
    ]);
    console.log(`Created ${insertResult.length} products.`);
}



async function initUsers(){
    //delete all users
    const deleteResult = await User.deleteMany()
    console.log(`Deleted ${deleteResult.deletedCount} users`)

    //create initial users
    const insertResult = await User.insertMany([
        {email:'admin@example.com', password: await User.hashPassword('1234')},
        {email: 'user1@example.com', password: await User.hashPassword('1234')}
      
    ])
    console.log(`Created ${insertResult.length} users.`)
}

//comprobacion para borrar los datos iniciales
function  ask(questionText){
    return new Promise((resolve , reject) => {
        const consoleInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        consoleInterface.question(questionText, answer =>{
            consoleInterface.close()
            resolve(answer)
        })
    })
}

