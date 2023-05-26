// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})


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
    
    const fs = require('fs');
const xmlJs = require('xml-js');

fs.readFile('file.xml', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const result = xmlJs.xml2js(data, options);
    console.log(result); // объект JavaScript, представляющий содержимое файла XML
  }
});
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


// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})