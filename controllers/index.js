const stream = require('stream')
const auth = require('../lib/googleAuth')
module.exports = {
    get: async (req, res) => {
        try {
            const parentsId = req.params.folderId
            const files = [];
            const data = await auth.files.list({
                q: '\''+parentsId+'\' in parents',
                fields: 'nextPageToken, files(id, name)',
                spaces: 'drive',
            });
            Array.prototype.push.apply(files, data.data.files);
            return res.json(files)
        } catch (e) {
            res.json(e.message)
        }
    },
    post: async (req, res) => {
            try {
                const fileObject = req.file
                const parentsId = req.params.folderId

                const bufferStream = new stream.PassThrough();
                bufferStream.end(fileObject.buffer);
                // console.log(bufferStream)
                const { data } = await auth.files.create({
                    media: {
                        mimeType: fileObject.mimeType,
                        body: bufferStream,
                    },
                    requestBody: {
                        name: fileObject.originalname,
                        parents: parentsId ? [parentsId] : [],
                    },
                    fields: 'id,name',
                });
                const fileId = data.id
                await auth.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    }
                })
                data.link = `https://drive.google.com/file/d/${data.id}/view?usp=share_link`

                res.json({
                    'status': 200,
                    'data': data,
                })
            } catch (e) {
                res.json(e.message)
            }
    }
}