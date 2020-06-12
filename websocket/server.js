const net = require('net');
const SshClient = require('ssh2').Client;
const fs = require('fs');

const connections = [];

// Create a server object
const server = net.createServer((connection) => {

    connections.push(connection);

    // Create ssh client
    const sshClient = new SshClient();

    connections.push(sshClient);

    // Forward ssh client output when client is ready
    sshClient.on('ready', () => {
        console.log('SSH client is ready. Forwarding out.')
        sshClient.forwardOut(
            '127.0.0.1',
            0,
            '127.0.0.1',
            '3306',
            (err, sshStream) => {
                if (err) {
                    server.close();
                    server.emit('error', err)
                }
                server.emit('success');
                connection.pipe(sshStream).pipe(connection)
            }
        );
    });


    // Connect to remote server using ssh client
    try {
        sshClient
            .connect({
                host: '138.197.136.183',
                port: 22,
                username: 'forge',
                privateKey: fs.readFileSync('/Users/sanjit/.ssh/id_rsa')
            });
    } catch (err) {
        server.emit('error', 'SSH client error: ' + err)
    }

    connection.on('error', (err) => {
        server.emit('error', 'Connection Error:' + err)
    });
});

// Handle server error
server.on('error', (err) => {
    console.error(err);
});

// Close connections when server closes
server.once('close', () => {
    connections.forEach((conn) => conn.end())
});

// Open server on port 9898
server.listen(9898, () => {
    console.log('opened server on', server.address().port);
});