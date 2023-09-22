import { FtpSrv } from 'ftp-srv'
import { createServer } from 'http'

// Quick start, create an active ftp server.
const hostname = '0.0.0.0'
const port = 2000

const ftpServer = new FtpSrv({
	url: `ftp://${hostname}:${port}`,
	anonymous: true,
})

const server = createServer((req, res) => {
	switch (req.url) {
		case '/overview': {
			res.end('Welcome to the "overview page" of the nginX project')
			break
		}
		case '/api': {
			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(
				JSON.stringify({
					product_id: 'xyz12u3',
					product_name: 'NginX injector',
				}),
			)
			break
		}
		default:
			res.end('Successfully started a server')
	}
})

server.listen(3000, 'localhost', () => {
	console.log('Listening for request')
})

ftpServer.on('login', (data, resolve, reject) => {
	resolve({ root: '/Users/dan/Desktop/Node/' })
	console.log('data: ' + data)
	console.log('resolve: ' + resolve)
	console.log('reject: ' + reject)
})

ftpServer.on('client-error', (connection, context, error) => {
	console.log('connection: ' + connection)
	console.log('context: ' + context)
	console.log('error: ' + error)
})

ftpServer.listen().then(() => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
