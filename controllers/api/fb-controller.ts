const Post = require('../../class/fb/page')

exports.getPageDetails = async (req: any, res: any, next: any) => {
    try {
        let data = new Post()
        data = await data.getPageDetils()
        res.status(200).json({ data })
    } catch (error) {
        console.log(error)
    }
}
