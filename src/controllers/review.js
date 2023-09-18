const Review = require('../models/review');
const { Op } = require("sequelize");


async function createReview(req){
    const { title, type, rating, opinion, watched_at, external_id, image } = req.body;
    const newReview = await Review.createInstance(title, type, rating, opinion, new Date(watched_at), external_id, image);
    return newReview;
}

async function getAllReviews(req){
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
        return reviews;
    }
    catch (error) {
        //console.log(error);
        throw new Error('Internal Server Error');
    }
}

async function getReview(req){
    const id = req.params.id;
    return await Review.findByPk(Number(id));
}

async function apiCreateReview(req, res){
    return res.json(await createReview(req));
}

async function apiGetAllReviews(req, res){
    try {
        return res.json(await getAllReviews(req));
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function apiGetReview(req, res){
    return res.json(await getReview(req));
}

async function viewGetAllReviews(req, res) {
    try {
        const reviews = await getAllReviews(req);
        return res.render('index', {reviews: reviews});
    }
    catch (error) {
        //console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function viewCreateReview(req, res) {
    return res.render('createReview');
}

module.exports = { apiCreateReview, apiGetAllReviews, apiGetReview, viewGetAllReviews, viewCreateReview };