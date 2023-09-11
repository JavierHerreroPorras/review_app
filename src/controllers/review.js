const Review = require('../models/review');
const { Op } = require("sequelize");

async function createReview(req, res){
    const { title, type, rating, opinion, watched_at } = req.body;
    const newReview = await Review.createInstance(title, type, rating, opinion, new Date(watched_at));
    return res.json(newReview);
}

async function getAllReviews(req, res){
    var name = '';
    if (req.query){
        name = req.query.name;
    }
    var reviews = {};
    try {
        if (name){
            reviews = await Review.findAll({
                where: {
                    title: {
                        [Op.substring]: name,
                    }
                }
            })
        }
        else {
            reviews = await Review.findAll();
        }
    }
    catch (error) {
        console.log(error)
    }
    return res.json(reviews);
}

async function getReview(req, res){
    const id = req.params.id;
    return res.json(await Review.findByPk(Number(id)));
}

module.exports = { createReview, getAllReviews, getReview };