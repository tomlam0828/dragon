const { Router } = require('express');
const AccountTable = require('../acccount/table');
const { hash } = require('../acccount/helper');
const AccountDragonTable = require('../accountDragon/table');
const { setSession, authenticatedAccount } = require('./helper');
const Session = require('../acccount/session');
const { getDragonWithTraits } = require('../dragon/helper');

const router = Router();

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    AccountTable.getAccount({ usernameHash })
        .then(({ account }) => {
            if (!account) {
                return AccountTable.storeAccount({ usernameHash, passwordHash })
            } else {
                const err = new Error('This username has already been taken');

                err.statusCode = 409;

                throw err;
            }
        })
        .then(() => {
            return setSession({ username, res })
        })
        .then(({ message }) => res.json({ message }))
        .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    AccountTable.getAccount({ usernameHash: hash(username) })
        .then(({ account }) => {
            if (account && account.passwordHash === hash(password)) {
                const { sessionId } = account

                return setSession({ username, res, sessionId })
            } else {
                const err = new Error('Incorrect username/password');

                err.statusCode = 409;

                throw err
            }
        })
        .then(({ message }) => res.json({ message }))
        .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
    const { username } = Session.parse(req.cookies.sessionString);

    AccountTable.updateSessionId({
        sessionId: null,
        usernameHash: hash(username)
    })
        .then(() => {
            res.clearCookie('sessionString');

            res.json({ message: 'Successful logout' });
        })
        .catch(error => next(error));
});

router.get('/authenticated', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ authenticated }) => res.json({ authenticated }))
        .catch(error => next(error));
});

router.get('/dragons', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account }) => {
            return AccountDragonTable.getAccountDragons({
                accountId: account.id
            })
        })
        .then(({ accountDragons }) => {
            return Promise.all(
                accountDragons.map(accountDragon => {
                    return getDragonWithTraits({ dragonId: accountDragon.dragonId });
                })
            );
        })
        .then(dragons => {
            res.json({ dragons });
        })
        .catch(err => next(err));
});

module.exports = router;