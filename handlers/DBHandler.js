import mongoose from 'mongoose'

//The uri for the MongoDB Atlas server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.mzgh0.mongodb.net/myDB?retryWrites=true&w=majority
`
/**DBHandler
 * Sets up connection for live database
 */

export async function connect() {
	try {
		mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
	} catch (err) {
		console.log(`FAILED TO CONNECT TO MONGODB ATLAS: ${err}`)
		process.exit(1)
	}
	const db = mongoose.connection

	db.on('error', err => console.error(err))
	db.on('open', () => console.log(`connected to database: {host: ${db.host}, port: ${db.port}, name:${db.name}}`))
}

export async function close() {
	mongoose.connection.close()
}
