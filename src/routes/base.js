const { searchMedia, getMedia } = require('../controllers/media.js');
const { createReview, getAllReviews, getReview } = require('../controllers/review.js');

function configureRoutes(app) {
    app.get('/reviews', getAllReviews);
    
    app.post('/reviews', createReview);

    app.get('/reviews/:id([0-9]+)', getReview);

    app.get('/media', searchMedia);

    app.get('/media/:id([A-Za-z0-9]+)', getMedia);

    });
}

module.exports = configureRoutes;