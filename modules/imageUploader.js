/**
 * @module uploadImage uploads an image to the local filesystem
 * @param ctx context object which contains the requested files to be uploaded
 */

import fs from 'fs-extra'
export default async function uploadImage(ctx) {
	console.log('uploading image')
	if(ctx.request.files.image) {
		await fs.copy(ctx.request.files.image.path, `./uploads/${ctx.request.files.image.name}`, (err) => {
			if (err) {
				console.log(err)
				ctx.hbs.error = err.message
				ctx.render('error', ctx.hbs)
				return null
			}
			console.log(`Finished uploading to ./uploads/${ctx.request.files.image.name}`)
		})
	}
}
