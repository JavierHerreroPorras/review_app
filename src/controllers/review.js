const Review = require('../models/review');
const { Op } = require("sequelize");

async function createReview(req, res){
    const { title, type, rating, opinion, watched_at } = req.body;
    const newReview = await Review.createInstance(title, type, rating, opinion, new Date(watched_at));
    return res.json(newReview);
}

async function getAllReviews(req, res){
    const { title, type, rating } = req.query || {};
    var query = {};
    if (title) {
        query.title = {[Op.substring]: title};
    }
    if (type) {
        query.type = type;
    }
    if (rating) {
        query.rating = {[Op.gte]: rating};
    }

    try {
        const reviews = await Review.findAll({ where: query});
        return res.json(reviews);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getReview(req, res){
    const id = req.params.id;
    return res.json(await Review.findByPk(Number(id)));
}

module.exports = { createReview, getAllReviews, getReview };