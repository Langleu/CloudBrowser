const HistoryModel = require('./../models/History');

/**
 * @class
 * The HistoryService implementation which is the abstraction of the HistoryModel.
 */
class HistoryService {
    constructor() {

    }

    /**
     * @description creates an entry.
     * @param data consists of url and userId
     * @returns {*}
     */
    create = (data) => {
        return HistoryModel.create(data)
            .then(history => {
                return history;
            })
            .catch(err => {
                throw err;
            });
    };

    /**
     * @description find entry by given id.
     * @param id
     * @returns {Promise<any | never>}
     */
    findById = (id) => {
        return HistoryModel.findById(id).exec()
            .then(history => {
                return history;
            });
    };

    /**
     * @description find x entries with descending sorting to get the latest entries.
     * @param userId
     * @param limit
     * @returns {Promise<any | never>}
     */
    findByUserId = (userId, limit) => {
        return HistoryModel.find({userId: userId}).limit(limit).sort({date: -1}).exec()
            .then(history => {
                return history;
            })
    };
}

module.exports = new HistoryService();
