const express = require('express')
const app = express()
const port = 3000
const index = require('./routes')

app.use('/api/drive', index)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

