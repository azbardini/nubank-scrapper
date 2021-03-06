/* eslint-disable no-mixed-operators */
const ChargesScrapper = require('../scrapper/ChargesScrapper');
const { getPermissions } = require('../modules/CommonModule');
const { saveCharges } = require('../modules/ChargesModule.js');
let { context } = require('./SessionController');

async function index (req, res) {
    const userHasPermissions = await getPermissions(req);
    if (!userHasPermissions) {
        return res.status(401).json({ err: 'Unauthorized' });
    };
    ChargesScrapper.getCharges(context).then(response => {
        context = response;
        return res.json(context.data);
    }).catch(() => {
        return res.status(400).json({ err: 'Problem in getting charges' });
    });
}

async function store (req, res) {
    const userHasPermissions = await getPermissions(req);
    if (!userHasPermissions) {
        return res.status(401).json({ err: 'Unauthorized' });
    };
    const chargesObj = req && req.body || null;
    if (!chargesObj) {
        return res.status(400).json({ err: 'Problem saving charges' });
    }
    saveCharges(chargesObj).then(() => {
        return res.status(200).json();
    }).catch(() => {
        return res.status(400).json({ err: 'Problem saving charges' });
    });
}

module.exports = {
    index,
    store
};
