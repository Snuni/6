const {pool} = require('./datapl.js')
async function showFolders(){
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
}