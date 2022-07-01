const FTP = require('ftp')

const ftpConnect = async (host, port, user, password) => {
	const ftp = new FTP()
	try {
		await ftp.connect({host, port, user, password})
	} catch (e) {
		console.error(e)
	}
	return ftp
}

const ftpUpload = (ftp, file, fileSource, baseUrl) => new Promise(resolve => {
	let fileName = `${file.hash}${file.ext}`
	let c = 0
	ftp.on('ready', () => {
		ftp.list((err, files) => {
			if (err) throw err

			while (files.some(f => f.name === fileName)) {
				c += 1
				fileName = `${file.hash}(${c})${file.ext}`
			}

			ftp.put(fileSource, fileName, (err) => {
				if (err) throw err

				file.public_id = fileName
				file.url = `${baseUrl}${fileName}`

				ftp.end()
				resolve(file)
			})

		})
	})
})

const ftpDelete = (ftp, file, basePath) => new Promise(resolve => {
	ftp.on('ready', () => {
		ftp.delete(`${basePath}/${file.hash}${file.ext}`, (err) => {
			if (err) throw err
			ftp.end()
			resolve(file)
		})
	})
})

module.exports = {
	init(config) {
		const {host, port, user, password, basePath, baseUrl} = config
		const connection = async () => ftpConnect(host, port, user, password)
		return {
			upload: async (file) => ftpUpload(await connection(), file, file.buffer, baseUrl),
			uploadStream: async (file) => ftpUpload(await connection(), file, file.stream, baseUrl),
			delete: async (file) => ftpDelete(await connection(), file, basePath),
		}
	},
}
