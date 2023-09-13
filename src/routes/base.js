const { searchMovie, getMovie } = require('../controllers/movie.js');
const { createReview, getAllReviews, getReview } = require('../controllers/review.js');

function configureRoutes(app) {
    app.get('/reviews', getAllReviews);
    
    app.post('/reviews', createReview);

    app.get('/reviews/:id([0-9]+)', getReview);

    app.get('/movies', searchMovie);

    app.get('/movies/:id([A-Za-z0-9]+)', getMovie);

    });
}

module.exports = configureRoutes;