import mongoose, {Schema} from 'mongoose';

/**
 * @class
 * @description describes the history model, which is used for every visited entry.
 * @param url String
 * @param userId ObjectId
 * @param date Integer
 */
export const historySchema = new Schema({
        url: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        date: { type: Date, default: Date.now }
    },
    {collection: 'history'}
);

historySchema.index({userId: 1});

module.exports = mongoose.model('History', historySchema);
