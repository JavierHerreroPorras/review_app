const { searchMedia, getMedia } = require('../controllers/media.js');
const { createReview, getAllReviews, getReview } = require('../controllers/review.js');

function configureRoutes(app) {

    app.get('/', (req, res) => {
        res.render('index');
    })    

    app.get('/api/reviews', getAllReviews);
    
    app.post('/api/reviews', createReview);

    app.get('/api/reviews/:id([0-9]+)', getReview);

    app.get('/api/media', searchMedia);

    app.get('/api/media/:id([A-Za-z0-9]+)', getMedia);

    });
}

module.exports = configureRoutes;