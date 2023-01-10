const puppeteer = require('puppeteer')
const fs = require('fs/promises')

class Post {
    constructor() {

    }

    async getPageDetils(pageId: string) {
        let returner: {result?: any} = {}

        const browser = await puppeteer.launch({})
        const page = await browser.newPage()

        //let url = 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=MY&view_all_page_id=187899693689&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all'

        let url = "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=MY&view_all_page_id=154212051285906&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all"

        await page.goto(url, { 'timeout': 10000, 'waitUntil': 'load' });
        await this.waitTillHTMLRendered(page)
        await this.autoScroll(page);
        page.on('console', async (msg: any) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
        });

        let pageContent = await page.evaluate(async () => {
            let data: { pageName?: string, adsCount?: string, allAds?: object[] } = { }

            let pageName = document.querySelector<HTMLElement>("#content > div > div > div > div.x6s0dn4.x2izyaf.x78zum5.xdt5ytf.xh8yej3.x1vjfegm > div > div.xeuugli.x2lwn1j.x78zum5.xdl72j9.x1qughib.xexx8yu.xbxaen2.x18d9i69.x1u72gb5.x1anpbxc.x11i5rnm.xyorhqc.x1mh8g0r > div > div.xeuugli.x2lwn1j.x6s0dn4.x78zum5.xktsk01 > div > div > div > a > div")?.innerText
            let adsCount = document.querySelector<HTMLElement>("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div.x2izyaf.x78zum5.xl56j7k.x1rdy4ex.x19gl646 > div > div > div > div > div > div.x6s0dn4.x78zum5 > div")?.innerText
            let allAdsParent = document.querySelector("#content > div > div > div > div.x8bgqxi.x1n2onr6 > div._8n_0")

            let adsNodesArr: any = allAdsParent?.childNodes
            let adsArr: any = []

            adsNodesArr?.forEach(function (o: any, i: number) {
                if (i > 0) {
                    let monthPublished = adsNodesArr[i].childNodes[1].querySelector('[role="heading"]').textContent
                    let adsData: {monthPublished?: string, adsList?: object[]} = {
                        monthPublished: "",
                        adsList: [{}]
                    }
                    let adsList = (i == 1) ? adsNodesArr[i].querySelector("div:nth-child(4)").childNodes[0].childNodes : adsNodesArr[i].querySelector("div:nth-child(3)").childNodes[0].childNodes
                    let temp: object[] = []
                    adsList.forEach(function (o: any, i: any) {
                        let infoParent = o.querySelector("div.x1cy8zhl.x78zum5.xyamay9.x1pi30zi.x18d9i69.x1swvt13.x1n2onr6 > div > div").childNodes
                        let adsStatus = infoParent[0].querySelector("div > div.xeuugli.x2lwn1j.x78zum5.xdt5ytf > div:nth-child(1) > span").innerHTML
                        let adsRunDate = infoParent[1].querySelector("span").innerHTML
                        let platformsParent = infoParent[2].querySelector("div").childNodes
                        let adsId = infoParent[3].querySelector("div > div > span").innerHTML;

                        let platforms: string[] = []

                        adsId = adsId.replace("ID: ", "")

                        platformsParent.forEach(async function (o: any, i: any) {
                            const mouseEnterEvent = new Event('mouseenter')
                            o.dispatchEvent(mouseEnterEvent)

                            //#region code for tooltip. 

                            // var observer = new MutationObserver(function (mutations) {
                            //     if (document.querySelector(`[data-ownerid="${o.id}"]`)) {

                            //         let toolTip1 = document.querySelector(`[data-ownerid="${o.id}"]`).childNodes[0]
                            //         let toolTip2 = toolTip1.querySelector(`div`).childNodes[0]
                            //         let toolTip3 = toolTip2.querySelector(`div`).childNodes[0].textContent
                            //         //let rl = toolTip.querySelector("div.x8t9es0.x1fvot60.xo1l8bm.xxio538.x108nfp6.xq9mrsl.x1yc453h.x1h4wwuj.xeuugli").innerHTML
                            //         platforms.push("DAPAT")
                            //         console.log("PLATFORMS: ", toolTip3)
                            //         observer.disconnect();
                            //         //We can disconnect observer once the element exist if we dont want observe more changes in the DOM
                            //     }
                            // });

                            // // Start observing
                            // observer.observe(document.body, { //document.body is node target to observe
                            //     childList: true, //This is a must have for the observer with subtree
                            //     subtree: true //Set to true if changes must also be observed in descendants.
                            // });

                            //#endregion
                            platforms.push("DAPAT")
                        })

                        let adsParent = o.querySelector(`div.x1dr75xp.xh8yej3.x16md763 > div.xrvj5dj.xdq2opy.xexx8yu.xbxaen2.x18d9i69.xbbxn1n.xdoe023.xbumo9q.x143o31f.x7sq92a.x1crum5w > div:nth-child(${i + 1}) > div > div.xh8yej3 > div > div`)
                        let copy = adsParent.querySelector(`div.x6ikm8r.x10wlt62 > div > span > div > div > div`).innerHTML
                        let checkCreatives = adsParent.querySelector("div._23n- ")
                        
                        let creatives: any = []

                        if (checkCreatives) {
                            // Carousel
                            let el = adsParent.querySelector("div._23n- > div > div > div").childNodes
                            el.forEach((o: any, i: any) => {
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
            console.log("DATA: ", data)

            return data
        })

        returner.result = pageContent

        await browser.close()
        return returner
    }

    async waitTillHTMLRendered(page: any, timeout: number = 30000) {
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

    async autoScroll(page: any) {
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
                        resolve(timer);
                    }
                }, 100);
            });
        });
    }

    async waitForElm(parent: any, selector: any) {
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