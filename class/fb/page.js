const puppeteer = require('puppeteer')
const fs = require('fs/promises')

class Post {
    constructor() {

    }

    async getPageDetils(pageId) {
        let returner = {}

        const browser = await puppeteer.launch({})
        const page = await browser.newPage()
        //this.preparePageForTest(page)

        await page.goto('https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=MY&view_all_page_id=187899693689&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all')

        await page.waitForSelector("#content > div > div > div > div.x6s0dn4.x2izyaf.x78zum5.xdt5ytf.xh8yej3.x1vjfegm > div > div.xeuugli.x2lwn1j.x78zum5.xdl72j9.x1qughib.xexx8yu.xbxaen2.x18d9i69.x1u72gb5.x1anpbxc.x11i5rnm.xyorhqc.x1mh8g0r > div > div.xeuugli.x2lwn1j.x6s0dn4.x78zum5.xktsk01 > div > div > div > a > div")
        await page.waitForSelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div.x2izyaf.x78zum5.xl56j7k.x1rdy4ex.x19gl646 > div > div > div > div > div > div.x6s0dn4.x78zum5 > div");
        await page.waitForSelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div._8n_0");


        let pageContent = await page.evaluate(() => {
            let data = {}

            let pageName = document.querySelector("#content > div > div > div > div.x6s0dn4.x2izyaf.x78zum5.xdt5ytf.xh8yej3.x1vjfegm > div > div.xeuugli.x2lwn1j.x78zum5.xdl72j9.x1qughib.xexx8yu.xbxaen2.x18d9i69.x1u72gb5.x1anpbxc.x11i5rnm.xyorhqc.x1mh8g0r > div > div.xeuugli.x2lwn1j.x6s0dn4.x78zum5.xktsk01 > div > div > div > a > div").innerText
            let adsCount = document.querySelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div.x2izyaf.x78zum5.xl56j7k.x1rdy4ex.x19gl646 > div > div > div > div > div > div.x6s0dn4.x78zum5 > div").innerText
            let allAdsParent = document.querySelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div._8n_0")

            let arr = allAdsParent.childNodes
            let temp = []
            arr.forEach((o, i) => {
                if (i == 1) {
                    let arr2 = o.childNodes
                    arr2.forEach((o2, i2) => {
                        if (o2 == 0) {
                            let monthPublished = o2.querySelector('[role="heading"]')
                            temp.push(o2.innerText)
                        }
                    })
                }
            })

            data.pageName = pageName
            data.adsCount = adsCount
            data.allAds = temp

            return data
        })

        returner.result = pageContent

        await browser.close()
        return returner
    }

    async preparePageForTest(page) {
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
        await page.setUserAgent(userAgent);
    }
}

module.exports = Post