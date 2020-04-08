const puppeteer = require('puppeteer');

async function getBrowser(context){
    const browser = await puppeteer.launch({headless: true, defaultViewport: null, args : ['--window-size=1920,1080'],});
    return browser;
}

async function getPage(context){
    const page = await context.browser.newPage();
    return page;
}

async function dragAndDrop(page, originSelector, destinationSelector) {
    await page.waitFor(originSelector)
    await page.waitFor(destinationSelector)
    const origin = await page.$(originSelector)
    const destination = await page.$(destinationSelector)
    const ob = await origin.boundingBox()
    const db = await destination.boundingBox()
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2)
    await page.mouse.down()
    await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2)
    await page.mouse.up()
}

async function prudentClick(page, originSelector) {
    await page.waitFor(originSelector)
    const origin = await page.$(originSelector)
    const ob = await origin.boundingBox()
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2)
    await page.mouse.down()
    await page.mouse.up()
}

async function getTabNames(context){
    await page.goto('https://app.nubank.com.br/#/bills')
    await page.waitForSelector('.md-tab-content');
    let tabs = await page.evaluate(() => {
        let retObj = {};
        const rawTabs = document.querySelectorAll('.md-tab-themed');
        rawTabs.forEach(tab => {
            const monthId = tab.id;
            const monthName = tab.querySelector('.period').innerHTML
            retObj[monthId]=monthName;
        });
        return retObj
    });
    context.data = tabs;
    return context;
}

async function loadAllTabs(context){
    page = context.page || await getPage(context);
    context = await getTabNames(context);
    const tabs = Object.keys(context.data);
    await (new Promise(r => setTimeout(r, 5000)))
    for (const t of tabs) {
        await page.$eval(`#${t}`, tab => tab.click());
        // await (new Promise(r => setTimeout(r, 50)))
    }
    return context;
}    


module.exports = {
    getBrowser,
    getPage,
    dragAndDrop, 
    prudentClick, 
    loadAllTabs
}