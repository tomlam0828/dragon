const { Router } = require('express');
const AccountDragonTable = require('../accountDragon/table');
const router = new Router();
const DragonTable = require('../dragon/table');
const { authenticatedAccount } = require('./helper');
const { getPublicDragons } = require('../dragon/helper');


router.get('/new', (req, res, next) => {
    let accountId, dragon;

    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account }) => {
            accountId = account.id;

            dragon = req.app.locals.engine.generation.newDragon();

            return DragonTable.storeDragon(dragon);
        })
        .then(({ dragonId }) => {
            dragon.dragonId = dragonId;

            return AccountDragonTable.storeAccountDragon({ accountId, dragonId });
        })
        .then(() => res.json({ dragon }))
        .catch(error => next(error));
});

router.put('/update', (req, res, next) => {
    const { dragonId, nickname, isPublic, saleValue } = req.body;
    DragonTable.updateDragon({ dragonId, nickname, isPublic, saleValue })
        .then(() => res.json({ message: 'successfully updated dragon name!' }))
        .catch(err => next(err));
});

router.get('/public-dragons', (req, res, next) => {
    getPublicDragons()
        .then(({ dragons }) => res.json({ dragons }))
        .catch(err => next(err));
})

module.exports = router;