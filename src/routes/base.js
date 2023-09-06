const { createReview, getAllReviews, getReview } = require('../controllers/review.js');

function configureRoutes(app) {
    app.get('/reviews', getAllReviews);
    
    app.post('/reviews', createReview);

    app.get('/reviews/:id([0-9]+)', getReview);
    });

module.exports = configureRoutes;