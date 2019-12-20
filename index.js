const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadImage = require('./helpers/helpers')
var cors = require('cors');

const app = express()

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({ credentials: true, origin: true }))

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post('/uploads', async (req, res, next) => {

    try {
        const myFile = req.file
        console.log(myFile);
        const imageUrl = await uploadImage(myFile)

        console.log(imageUrl)

        res.status(200)
            .json({
                message: "success",
                data: imageUrl
            })

    } catch (error) {
        res.json('failed');
        // next(error)
    }


})

app.delete('/delete', async (req, res, next) => {
    console.log(req.query.imgname)

    const { Storage } = require('@google-cloud/storage')
    const path = require('path')
    const serviceKey = path.join(__dirname, 'config\\keys.json')

    const storeName = new Storage({
        keyFilename: serviceKey,
        projectId: 'effective-cacao-260014',
    }
    );

    try {
        await storeName
            .bucket('samanala_taxi_app')
            .file(req.query.imgname)
            .delete();

        res.json('success');
    } catch (error) {
        res.json(error.errors[0].message);
    }
})

app.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'Internal server error!',
    })
    next()
})

app.listen(9090, () => {
    console.log('app now listening for 9090')
})