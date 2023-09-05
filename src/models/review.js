const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database.js');

class Review extends Model {}

Review.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        validate: {
            isIn: {
                args: [['movie', 'anime', 'series']],
                msg: 'Value should be movie, anime or series'
            }
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 10
        }
    },
    opinion: {
        type: DataTypes.STRING
    },
    watched_at: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, { modelName: 'Review', sequelize });

Review.createInstance = async function (name, type, rating, opinion, watched_at) {
    const review = await Review.create({title: name, type: type, rating: rating, opinion: opinion, watched_at: watched_at});
    return review;
}

module.exports = Review;