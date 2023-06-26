const stream = require('stream')
const fs = require('fs');
const auth = require('../lib/googleAuth')
module.exports = {
    //get list file from folderId
    list: async (req, res) => {
        try {
            const parentsId = req.params.folderId
            const files = [];
            let query = {
                q: '\'' + parentsId + '\' in parents and trashed = false',
                fields: 'nextPageToken, files(id, name, mimeType, iconLink,hasThumbnail,thumbnailLink,webViewLink,contentHints)',
                spaces: 'drive',
                orderBy: 'folder',
                // trashed: true
            }
            if (Object.keys(req.query).length > 0) {
                query = {
                    q: `name contains '` + req.query.name + `'`,
                    fields: 'nextPageToken, files(id, name, mimeType, iconLink,hasThumbnail,thumbnailLink,webViewLink,contentHints)',
                    spaces: 'drive',
                    orderBy: 'folder',
                    // trashed: false
                }
            }
            const data = await auth.drive.files.list(query);
            Array.prototype.push.apply(files, data.data.files);
            return res.json(files)
        } catch (e) {
            res.json(e.message)
        }
    },

    //upload file
    uploadFile: async (req, res) => {
        try {
            const fileObject = req.file
            const parentsId = req.params.folderId

            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);
            // console.log(bufferStream)
            const { data } = await auth.drive.files.create({
                // uploadType:'resumable',
                media: {
                    mimeType: fileObject.mimeType,
                    body: bufferStream,
                },
                requestBody: {
                    name: fileObject.originalname,
                    parents: parentsId ? [parentsId] : [],
                },
                fields: 'id,name,mimeType,iconLink,hasThumbnail,thumbnailLink,webViewLink',
            });
            const fileId = data.id
            await auth.drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
            res.json({
                'status': 200,
                'data': data,
            })
        } catch (e) {
            res.json(e.message)
        }
    },

    //create folder
    createFolder: async (req, res) => {
        try {
            const name = req.body.name
            const parentsId = req.params.folderId
            const data = await auth.drive.files.create({
                requestBody: {
                    mimeType: 'application/vnd.google-apps.folder',
                    name: name,
                    parents: parentsId ? [parentsId] : [],
                },
                fields: 'id,name,mimeType,iconLink,hasThumbnail,thumbnailLink,webViewLink',
            });
            const folderId = data.data.id
            await auth.drive.permissions.create({
                fileId: folderId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
            res.json({
                'status': 200,
                'data': data.data,
            })
        } catch (e) {
            res.json(e.message)
        }
    },

    deleteFile: async (req, res) => {
        const fileId = req.body.id
        const data = await auth.drive.files.delete({
            fileId: fileId
        }).then(async function (response) {
            res.json({
                status: 200,
                message: 'Ok'
            })
        }, function (err) {
            return res.status(400).json({
                error: { msg: 'Deletion Failed for some reason' }
            })
        })

    },

    getLocation: async (req, res, next) => {
        const accessToken = await auth.token
        let headersList = {
            "Authorization": "Bearer " + accessToken.token,
            "Content-Type": "application/json;Charset=UTF-8"
        }
        const r = req.body
        // console.log(r)
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
            method: 'POST',
            // body: JSON.stringify({ name: r.name, mimeType: r.mimeType, contentLength: r.contentLength }),
            body: JSON.stringify(r),
            headers: headersList
        })
        // console.log(response)
        const location = response.headers.get('location')
        return res.json({ location: location, content_length: response.headers.get('content-length') })
        // return next()
    }
}
