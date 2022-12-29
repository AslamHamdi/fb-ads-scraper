const Post = require('../../class/fb/page')

exports.getPageDetails = async (req, res, next) => {
    try {
        let data = new Post()
        data = await data.getPageDetils()
        res.status(200).json({ data })
    } catch (error) {
        console.log(error)
    }
}
