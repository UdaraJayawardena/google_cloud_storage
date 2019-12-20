const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadImage = require('./helpers/helpers')

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

app.post('/uploads', async (req, res, next) => {

    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)

        res.status(200)
            .json({
                message: "Upload was successful",
                data: imageUrl
            })

    } catch (error) {
        next(error)
    }
})

app.put('/delete', async (req, res, next) => {
    console.log(req.body.imgname)

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
            .file(req.body.imgname)
            .delete();

    } catch (error) {
        console.log(error)
    }
    res.json('successfully deleted');
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