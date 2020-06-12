const net = require('net');

// Create a server object
const server = net.createServer((connection) => {

    connection.on('error', (err) => {
        server.emit('error', err)
    });

    connection.write('SERVER: Hello! This is server speaking.<br>');


    server.emit('error', 'Sending some love with errors');
    // socket.end('SERVER: Closing connection now.<br>');
}).on('error', (err) => {
    console.error(err);
});
// Open server on port 9898
server.listen(9898, () => {
    console.log('opened server on', server.address().port);
});