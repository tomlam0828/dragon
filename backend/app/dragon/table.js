const pool = require('../../databasePool');
const DragonTraitTable = require('../dragonTrait/table');

class DragonTable {
    static storeDragon(dragon) {
        const { birthdate, nickname, generationId, isPublic, saleValue } = dragon;

        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO dragon(birthdate, nickname, "generationId", "isPublic", "saleValue") 
                VALUES($1, $2, $3, $4, $5) RETURNING id`,
                [birthdate, nickname, generationId, isPublic, saleValue],
                (err, res) => {
                    if (err) return reject(err);

                    const dragonId = res.rows[0].id;

                    Promise.all(dragon.traits.map(({ traitType, traitValue }) => {
                        return DragonTraitTable.storeDragonTrait({
                            dragonId, traitType, traitValue
                        });
                    })).then(() => resolve({ dragonId }))
                        .catch(err => reject(err));
                }
            )
        });
    }
    static getDragon({ dragonId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT birthdate, nickname, "generationId", "isPublic", "saleValue" FROM dragon WHERE dragon.id = $1`,
                [dragonId],
                (err, res) => {
                    if (err) return reject(err);

                    if (res.rows.length === 0) return reject(new Error('no dragon'));
                    resolve(res.rows[0]);
                }
            )
        })
    }

    static updateDragon({ dragonId, nickname, isPublic, saleValue }) {
        const settingsMap = { nickname, isPublic, saleValue };

        const validQueries = Object.entries(settingsMap).filter(([settingKey, settingValue]) => {
            if (settingValue !== undefined) {
                return new Promise((resolve, reject) => {
                    pool.query(
                        `UPDATE dragon SET "${settingKey}" = $1 WHERE id = $2`,
                        [settingValue, dragonId],
                        (err, res) => {
                            if (err) return reject(err);

                            resolve();
                        }
                    )
                })
            }
        })

        return Promise.all(validQueries);
    }
}

DragonTable.updateDragon({ dragonId: 1, nickname: 'fooby' })
    .then(() => console.log('update!!'))
    .catch(err => console.error(err));

module.exports = DragonTable;