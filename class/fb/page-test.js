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

        //let url = 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=MY&view_all_page_id=187899693689&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all'

        let url = "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=MY&view_all_page_id=154212051285906&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all"

        await page.goto(url, { 'timeout': 10000, 'waitUntil': 'load' });
        await this.waitTillHTMLRendered(page)
        await this.autoScroll(page);

        let pageContent = await page.evaluate(async () => {
            let data = {}

            let pageName = document.querySelector("#content > div > div > div > div.x6s0dn4.x2izyaf.x78zum5.xdt5ytf.xh8yej3.x1vjfegm > div > div.xeuugli.x2lwn1j.x78zum5.xdl72j9.x1qughib.xexx8yu.xbxaen2.x18d9i69.x1u72gb5.x1anpbxc.x11i5rnm.xyorhqc.x1mh8g0r > div > div.xeuugli.x2lwn1j.x6s0dn4.x78zum5.xktsk01 > div > div > div > a > div").innerText
            let adsCount = document.querySelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div.x2izyaf.x78zum5.xl56j7k.x1rdy4ex.x19gl646 > div > div > div > div > div > div.x6s0dn4.x78zum5 > div").innerText
            let allAdsParent = document.querySelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div._8n_0")

            let adsNodesArr = allAdsParent.childNodes
            let adsArr = []

            adsNodesArr.forEach(function (o, i) {
                if (i > 0) {
                    let monthPublished = adsNodesArr[i].childNodes[1].querySelector('[role="heading"]').textContent
                    let adsData = {
                        monthPublished: "",
                        adsList: []
                    }

                    let adsList = (i == 1) ? adsNodesArr[i].querySelector("div:nth-child(4)").childNodes[0].childNodes : adsNodesArr[i].querySelector("div:nth-child(3)").childNodes[0].childNodes
                    let temp = []
                    adsList.forEach(function (o, i) {
                        let infoParent = o.querySelector("div.x1cy8zhl.x78zum5.xyamay9.x1pi30zi.x18d9i69.x1swvt13.x1n2onr6 > div > div").childNodes
                        let adsStatus = infoParent[0].querySelector("div > div.xeuugli.x2lwn1j.x78zum5.xdt5ytf > div:nth-child(1) > span").innerHTML
                        let adsRunDate = infoParent[1].querySelector("span").innerHTML
                        let platformsParent = infoParent[2].querySelector("div").childNodes
                        let adsId = infoParent[3].querySelector("div > div > span").innerHTML;

                        let platforms = []
                        adsId = adsId.replace("ID: ", "")
                        platformsParent.forEach(async function (o, i) {
                            const mouseEnterEvent = new Event('mouseenter')
                            o.dispatchEvent(mouseEnterEvent)
                        })

                        platformsParent.forEach(async function (o, i) {
                            let toolTip = document.querySelector(`[data-ownerid="${o.id}"]`)
                            let rl = toolTip.querySelector("div.x8t9es0.x1fvot60.xo1l8bm.xxio538.x108nfp6.xq9mrsl.x1yc453h.x1h4wwuj.xeuugli").classList
                            platforms.push(rl)
                        })

                        let adsParent = o.querySelector(`div.x1dr75xp.xh8yej3.x16md763 > div.xrvj5dj.xdq2opy.xexx8yu.xbxaen2.x18d9i69.xbbxn1n.xdoe023.xbumo9q.x143o31f.x7sq92a.x1crum5w > div:nth-child(${i + 1}) > div > div.xh8yej3 > div > div`)
                        let copy = adsParent.querySelector(`div.x6ikm8r.x10wlt62 > div > span > div > div > div`).innerHTML
                        let checkCreatives = adsParent.querySelector("div._23n- ")
                        let creatives = []

                        if (checkCreatives) {
                            // Carousel
                            let el = adsParent.querySelector("div._23n- > div > div > div").childNodes
                            el.forEach((o, i) => {
                                creatives.push(o.querySelector("img").src)
                            })
                        } else {
                            // Video or single image
                            let el = adsParent.querySelector(`div.x6ikm8r.x10wlt62`)
                            creatives = el.querySelector("video") ? el.querySelector("video").src : el.querySelector("img").src
                        }

                        let adsAttr = {
                            adsStatus: adsStatus,
                            adsRunDate: adsRunDate,
                            adsId: adsId,
                            copy: copy,
                            platforms: platforms,
                            creatives: creatives
                        }

                        temp.push(adsAttr)
                    })

                    adsData.monthPublished = monthPublished
                    adsData.adsList = temp
                    adsArr.push(adsData)
                }
            })

            data.pageName = pageName
            data.adsCount = adsCount
            data.allAds = adsArr

            return data
        })

        returner.result = pageContent

        await browser.close()
        return returner
    }

    async waitTillHTMLRendered(page, timeout = 30000) {
        const checkDurationMsecs = 1000;
        const maxChecks = timeout / checkDurationMsecs;
        let lastHTMLSize = 0;
        let checkCounts = 1;
        let countStableSizeIterations = 0;
        const minStableSizeIterations = 3;

        while (checkCounts++ <= maxChecks) {
            let html = await page.content();
            let currentHTMLSize = html.length;

            let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

            console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

            if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
                countStableSizeIterations++;
            else
                countStableSizeIterations = 0; //reset the counter

            if (countStableSizeIterations >= minStableSizeIterations) {
                console.log("Page rendered fully..");
                break;
            }

            lastHTMLSize = currentHTMLSize;
            await page.waitForTimeout(checkDurationMsecs);
        }
    }

    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    async waitForElm(parent, selector) {
        return new Promise(resolve => {
            if (parent.querySelector(selector)) {
                return resolve(parent.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (parent.querySelector(selector)) {
                    resolve(parent.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(parent.body, {
                childList: true,
                subtree: true
            });
        });
    }

}

module.exports = Post