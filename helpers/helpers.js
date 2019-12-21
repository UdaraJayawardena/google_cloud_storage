const util = require('util')

const { format } = util

const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, '\\..\\config\\keys.json')

const { Storage } = Cloud
const gc = new Storage({
    keyFilename: serviceKey,
    projectId: 'effective-cacao-260014',
})


const bucket = gc.bucket('samanala_taxi_app')

const uploadImage = (file) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file
    console.log(file)

    const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
        resumable: false

    })

    blobStream.on('finish', () => {
        const publicUrl = format(
            // `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            `https://console.cloud.google.com/storage/browser/${bucket.name}/${blob.name}`
        )
 

        resolve(publicUrl)
    })
        .on('error', () => {
            reject(`Unable to upload image, something went wrong`)
        })
        .end(buffer)
})

module.exports = uploadImage
