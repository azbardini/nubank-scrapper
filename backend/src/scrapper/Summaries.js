const puppeteer = require('puppeteer');
const {getPage, loadAllTabs} = require('./Utils');

async function getSummaries(context){
    context = await loadAllTabs(context);
    await (new Promise(r => setTimeout(r, 1500)))
    const tabNames = context.data;
    page = context.page || await getPage(context);
    await page.goto('https://app.nubank.com.br/#/bills')
    await page.waitForSelector('.md-tab-content');
    let summaries = await page.evaluate(() => {
        let retObj = {};
        const months = document.querySelectorAll('div[role="tabpanel"]');
        months.forEach(month => {
            const monthId = month.id ? month.id.substr(month.id.length - 7) : '';
            retObj[monthId]={};
            const summaries = month.querySelectorAll('.row .summary .amount-due .cell');
            summaries.forEach(summary => {
                const amount = summary.querySelector('.amount') ? summary.querySelector('.amount').innerText : '';
                const dueDate = summary.querySelector('.due .date') ? summary.querySelector('.due .date').innerText : '';
                retObj[monthId]={
                    amount,
                    dueDate,
                };   
            });
        });
        return retObj;
    });
    // console.log('getSummaries -> summaries', summaries);
    context.data = {
        tabNames,
        summaries
    }
    context.page = page
    return context;
}

module.exports = {
    getSummaries
}