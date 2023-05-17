// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})

var pdfmake = require('pdfmake');

const TelegramBot = require('node-telegram-bot-api');
const command = require('nodemon/lib/config/command');
const token = '5877622379:AAHHwz7lruFtcfcnQ9MopdRh6Sb1AQ7u-E0'
const bot = new TelegramBot(token, {polling: true})
const chatId = -1001887927346
const pdfMakePrinter = require('pdfmake/src/printer')
// Блок кода, который нужен для исправления ошибки с CORS
// fastify.register(require('@fastify/cors'), (instance) => {
//     return (req, callback) => {
//         const corsOptions = {
//             // This is NOT recommended for production as it enables reflection exploits
//             origin: true
//         };

//         // do not include CORS headers for requests from localhost
//         if (/^localhost$/m.test(req.headers.origin)) {
//             corsOptions.origin = false
//         }

//         // callback expects two parameters: error and options
//         callback(null, corsOptions)
//     }
// })


const posts = [{
    name: 1,
    date:new Date()
}]


bot.onText(/\/test/, async(msg)=>{
    let str = "1"
    for (const item of posts ){
        str+=`<code>Название</code>${item.name}\nДата ${item.data}\n---------------------\n`    
    }
    await bot.sendMessage(chatId,str,{parse_mode:'HTML'})  
})
fastify.post('/post/add',async function(request,reply){
    const object = request.body
    object.createdAt = new Date()
    console.log(object);
    posts.push(object)
    await bot.sendMessage(chatId,JSON.stringify("Хай Бибис"))
})

// // Создание маршрута для get запроса
// fastify.post('/folders', function (request, reply) {
//     reply.send({ hello: 'world' })
// })

// // Создание маршрута для post запросаno
// // fastify.post('/post',function (request, reply) {
// //     console.log(`Тело запроса: `,JSON.stringify(request.body))
// //     reply.send(request.body)
// // })

// // Создание запроса с использование path параметров
// fastify.get('/:id',function (request, reply) {
//     console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
//     reply.send(request.params)
// })

// // Создание запроса с использованием query параметров
// fastify.get('/query',function (request, reply) {
//     console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
//     reply.send(request.query)
// })
// Импортируем библиотеку fastify для развертывания веб-сервера

const Pool = require('pg-pool')
const pool = new Pool({
    database: 'postgres',
    user: 'postgres',
    password: '123456789',
    port: 5432,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500,
})
pool.on('error', (error, client) => {
    console.error(error)
    process.exit(-1)
})
pool.on('connect', client => {
    console.log('New client')
})
pool.on('remove', client => {
    console.log('Client pool removed')
})

// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})
var fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Black.ttf',
      bold: 'fonts/Roboto-Bold.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
  };
// Получение всех папок
fastify.post('/folder/show',async function(request,reply){
    let data = {
        message:'error',
        statusCode:400
    }
    const urlName = '/folder/show'
    const client = await pool.connect()
    try {
        const folders = await client.query(`SELECT "folderId", "folderName", "folderColor"
                                            FROM folders`);
        data.message = folders.rows
        data.statusCode = 200
    }
    catch (e) {
        console.log(e);
    }
    finally {
        client.release()
        console.log(urlName, 'client release()');
    }
    reply.send(data)
})

fastify.post('/folder/create',async function (request, reply){
    let data = {
        message: 'error',
        statusCode:400
    }
    const urlName = '/folder/create'
    const client = await pool.connect()
    try {
        const folder = await client.query(`INSERT INTO folders ("folderName", "folderColor")
                                           VALUES ($1, $2) RETURNING "folderId","folderName","folderColor"`, [ request.body.folderName, request.body.folderColor ]);
        if(folder.rowCount > 0 && folder.rows.length > 0){
            data.message = folder.rows[0]
            data.statusCode = 200
        }
        else{
            console.log(`Произошла ошибка при обновлении записи`);
        }
        console.log(folder);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        client.release()
        console.log(urlName,'client release()');
    }
    reply.send(data)
})

fastify.post('/folder/update',async function(request,reply){
    let data = {
        message: 'error',
        statusCode:400
    }
    const urlName = '/folder/update'
    const client = await pool.connect()
    try {
        const folder = await client.query(`UPDATE folders
                                           SET "folderName"  = $1
                                             , "folderColor" = $3
                                           WHERE "folderId" = $2
                                           RETURNING *`, [ request.body.folderName, request.body.folderId, request.body.folderColor ]);
        console.log(folder);
        if(folder.rowCount > 0){
            data.message = folder.rows[0]
            data.statusCode = 200
        }
        else{
            console.log(`Произошла ошибка при обновлении записи`);
        }
        console.log(folder);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        client.release()
        console.log(urlName,'client release()');
    }
    reply.send(data)
})
async function docFileFromStream(document) {
    const chunks = [];
    let result = null;
    return new Promise(function (resolve, reject) {
        try {
            document.on('data', function (chunk) {
                chunks.push(chunk);
            });
            document.on('end', async function () {
                result = Buffer.concat(chunks);
                console.log('end');
                resolve(result);
                
            });
            document.on('error', reject);
            document.end();
        } catch (error) {
            console.log('docFileFromStream ERROR');
            console.log(error);
            reject(null);
        }
    });
}

fastify.post('/pdf', async(request,reply)=>{
    try{
        //1 запрос в базу на получение всех задач
        const create = '/pdf'
        const client = await pool.connect()

        


        //2 Сформировать строку вида item1\item2\item3
        
        //3 Передать сформированную строку в content 
        // const printer = new pdfMakePrinter(fonts)
        // const docFile = printer.createPdfKitDocument({
        //     content:[
        //         'First paragraph',
        //         'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        //     ]
        // })
        
        // const doc = await docFileFromStream(docFile)
        // reply.header('Content-Type','application/pdf')
        // reply.send(doc)
    }
    
    catch (e) {
        console.log(e);
    }
});

// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})