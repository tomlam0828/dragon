const { REFRESH_RATE, SECONDS } = require('../config');
const Dragon = require('../dragon/index');
const refreshRate = REFRESH_RATE * SECONDS;


class Generation {
    constructor() {
        this.expiration = this.calculateExpiration();
        this.generationId = undefined;
    }

    calculateExpiration() {
        const expirationPeriod = Math.floor(Math.random() * (refreshRate / 2));

        const msUntilExpiration = Math.random() < 0.5 ? refreshRate - expirationPeriod : refreshRate + expirationPeriod;

        return this.expiration = new Date(Date.now() + msUntilExpiration);
    }

    newDragon() {
        if (Date.now() > this.expiration) {
            throw new Error(`This generation expired on ${this.expiration}`);
        }
        return new Dragon({ generationId: this.generationId });
    }
}

module.exports = Generation;

