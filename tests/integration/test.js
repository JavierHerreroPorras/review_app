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

  it('should filter all reviews by name', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/reviews?name=Review 2');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 2')
    expect(res.body[1]).to.have.property('title').deep.equal('Review 2.2')
  });

  it('should get one review by its id', async function () {
    const review = await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get(`/reviews/${review.id}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title').equal(review.title);
    expect(res.body).to.have.property('type').equal(review.type);
    expect(res.body).to.have.property('rating').equal(review.rating);
    expect(res.body).to.have.property('opinion').equal(review.opinion);
    expect(res.body).to.have.property('id').equal(review.id);
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
