const SshClient = require('ssh2').Client;

var connection = new SshClient();

connection.on('ready', () => {
    console.log('Client::ready');

    // When ssh is ready execute command
    connection.exec('uptime', (err, stream) => {
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        })
    })

})
