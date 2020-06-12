const SshClient = require('ssh2').Client;
const fs = require('fs');

var connection = new SshClient();

connection.on('ready', () => {
    console.log('Client::ready');

    // When ssh is ready execute command
    connection.exec('uptimes', (err, stream) => {
        stream
            .on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                connection.end()
            })
            .on('data', (data) => {
                console.log('Output::' + data)
            })
            .stderr.on('data', (data) => {
                console.log('STDERR ' + data)
            });
    })
}).connect({
    host: '138.197.136.183',
    port: 22,
    username: 'forge',
    privateKey: fs.readFileSync('/Users/sanjit/.ssh/id_rsa')
});
