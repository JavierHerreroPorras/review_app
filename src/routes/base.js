const { createReview, getAllReviews } = require('../controllers/review.js');

function configureRoutes(app) {
    app.get('/reviews', getAllReviews);
    
    app.post('/reviews', createReview);
    });

module.exports = configureRoutes;