const Review = require('../models/review');

function configureRoutes(app) {
    app.get('/reviews', async function(req, res){
        const reviews = await Review.findAll();
        res.json(reviews);
    });
    
    app.post('/reviews', async function(req, res){
        const { title, type, rating, opinion, watched_at } = req.body;
        const newReview = await Review.createInstance(title, type, rating, opinion, new Date(watched_at));
        res.json(newReview);
    });

module.exports = configureRoutes;