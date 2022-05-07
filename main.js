const config = require('./config');

const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send(JSON.stringify({
        message: 'Hello World!'
    }))
})

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})