// code away!

const server = require('./server')

port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})