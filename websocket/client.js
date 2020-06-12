// Node.js socket client script
const net = require('net');
// Connect to a server @ port 9898
const client = net.createConnection({ port: 9898 }, () => {
    console.log('Connecting to local server...');
});

client.on('data', (data) => {
    console.log(data);
});

client.on('error', (err) => {
    console.log(err)
});

client.on('end', () => {
    console.log('CLIENT: I disconnected from the server.');
});



