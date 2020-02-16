const uuid = require('uuid/v4');
const { hash } = require('./helper');

const SEPERATOR = '|';

class Session {
    constructor({ username }) {
        this.username = username;
        this.id = uuid();
    }

    toString() {
        const { username, id } = this;

        return Session.sessionString({ username, id });
    }

    static parse(sessionString) {
        const sessionData = sessionString.split(SEPERATOR);

        return {
            username: sessionData[0],
            id: sessionData[1],
            sessionHash: sessionData[2]
        };
    }

    static verify(sessionString) {
        const { username, id, sessionHash } = Session.parse(sessionString);

        const accountData = Session.accountData({ username, id });

        return hash(accountData) === sessionHash;
    }

    static accountData({ username, id }) {
        return `${username}${SEPERATOR}${id}`;
    }

    static sessionString({ username, id }) {
        const accountData = Session.accountData({ username, id });

        return `${accountData}${SEPERATOR}${hash(accountData)}`;
    }
}

module.exports = Session;