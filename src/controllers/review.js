const Review = require('../models/review');

async function createReview(req, res){
    const { title, type, rating, opinion, watched_at } = req.body;
    const newReview = await Review.createInstance(title, type, rating, opinion, new Date(watched_at));
    return res.json(newReview);
}

async function getAllReviews(req, res){
    const reviews = await Review.findAll();
    return res.json(reviews);
}

async function getReview(req, res){
    const id = req.params.id;
    return res.json(await Review.findByPk(Number(id)));
}

module.exports = { createReview, getAllReviews, getReview };