const Post2 = require('../../class/fb/page')

exports.getPageDetails = async (req: any, res: any, next: any) => {
    try {
        let data = new Post2()
        data = await data.getPageDetils()
        res.status(200).json({ data })
    } catch (error) {
        console.log(error)
    }
}
