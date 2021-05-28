import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'

/**Sets up an in-memory database for testing */

const mongod = new MongodbMemoryServer.MongoMemoryServer()

/**Connect to the MongoMemoryServer in-memory database */
export async function connect() {
	const uri = await mongod.getUri()

	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	}

	await mongoose.connect(uri, mongooseOpts)
}

/**Drops the database and closes the connection */
export async function close() {
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await mongod.stop()
}

/**Drops all documents from all collections */
export async function clearDatabase() {
	const collections = mongoose.connection.collections

	for (const key in collections) {
		const collection = collections[key]
		await collection.deleteMany()
	}
}
