/* eslint-disable no-mixed-operators */
const TransactionsScrapper = require('../scrapper/TransactionsScrapper');
const { saveTransactions } = require('../modules/TransactionsModule');
const { getPermissions } = require('../modules/CommonModule');
let { context } = require('./SessionController');

async function index (req, res) {
    const userHasPermissions = await getPermissions(req);
    if (!userHasPermissions) {
        return res.status(401).json({ err: 'Unauthorized' });
    };
    TransactionsScrapper.getTransactions(context).then(response => {
        context = response;
        return res.json(context.data);
    }).catch(() => {
        return res.status(400).json({ err: 'Problem in getting transactions' });
    });
}

async function store (req, res) {
    const userHasPermissions = await getPermissions(req);
    if (!userHasPermissions) {
        return res.status(401).json({ err: 'Unauthorized' });
    };
    const transactionsObj = req && req.body || null;
    if (!transactionsObj) {
        return res.status(400).json({ err: 'Problem saving profile' });
    }
    saveTransactions(transactionsObj).then(() => {
        return res.status(200).json();
    }).catch(() => {
        return res.status(400).json({ err: 'Problem saving profile' });
    });
}

module.exports = {
    index,
    store
};
