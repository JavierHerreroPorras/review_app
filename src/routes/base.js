const { apiSearchMedia, apiGetMedia, viewGetMedia } = require('../controllers/media.js');
const { apiCreateReview, apiGetAllReviews, apiGetReview, viewGetAllReviews, viewCreateReview } = require('../controllers/review.js');

function configureRoutes(app) {

    app.get('/', viewGetAllReviews);  
    
    app.get('/reviews/new', viewCreateReview);

    app.get('/media/:id([A-Za-z0-9]+)', viewGetMedia);

    app.get('/api/reviews', apiGetAllReviews);
    
    app.post('/api/reviews', apiCreateReview);

    app.get('/api/reviews/:id([0-9]+)', apiGetReview);

    app.get('/api/media', apiSearchMedia);

    app.get('/api/media/:id([A-Za-z0-9]+)', apiGetMedia);


    });
}

module.exports = configureRoutes;