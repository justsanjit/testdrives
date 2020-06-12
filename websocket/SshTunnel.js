import net from 'net'
import {Client as SshClient} from 'ssh2'
import fs from 'fs'


export default class SshTunnel {

    connections = []

    server = null

    constructor() {
        this.sshPort = 22
        this.srcPort = 0
        this.srcHost = 'localhost'
        this.localHost = 'localHost'
        this.server = server

        this.createServer()
    }

    create() {

    }

    createServer() {
        this.server = net.createServer();

        this.server.on('connection', (connection) => {
            this.connections.push(connection);

            // Create ssh client
            const sshClient = this.createSshClientFor(connection)
            this.connections.push(sshClient)

            // Connect ssh client to remote
            try {
                sshClient.connect({
                    host: '138.197.136.183',
                    port: 22,
                    username: 'forge',
                    privateKey: fs.readFileSync('/Users/sanjit/.ssh/id_rsa')
                })
            } catch (err) {
                this.server.emit('error', err)
            }

            connection.on('error', (error) => {
                this.server.emit('error', error)
            })
        })

        this.server.on('error', (error) => {
            console.log(error)
        })

        this.server.once('close', () => {
            this.connections.forEach(connection => connection.end())
        })
    }

    createSshClientFor(connection) {
        const sshClient = new SshClient();

        // Steam response handler
        const streamHandler = (error, stream) => {
            if (error) {
                this.server.close();
                this.server.emit('error', error)
            } else {
                this.server.emit('success')
                // Send response stream to connected client
                connection.pipe(stream).pipe(connection)
            }
        }

        // Forward port when server is ready
        sshClient.on('ready', () => {
            sshClient.forwardOut(
                '127.0.0.1',
                0,
                '127.0.0.1',
                '3306',
                streamHandler
            )
        })

        return sshClient;
    }
}