const chai = require('chai');
const chaiHttp = require('chai-http');
const Review = require('../../src/models/review.js');
const app = require('../../src/app.js');

const { expect } = chai;
chai.use(chaiHttp);

describe('Reviews API', function () {
  beforeEach(async () => {
    await Review.destroy({ where: {} });
  });

  it('should get all reviews', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/reviews');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
  });

  it('should create a new review', async function () {
    const newReview = {
      title: 'New Review',
      type: 'movie',
      rating: 9,
      opinion: 'Excellent movie',
      watched_at: new Date(),
    };

    const res = await chai.request(app).post('/reviews').send(newReview);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title').equal('New Review');
    expect(res.body).to.have.property('type').equal('movie');
    expect(res.body).to.have.property('rating').equal(9);
    expect(res.body).to.have.property('opinion').equal('Excellent movie');
  });
});