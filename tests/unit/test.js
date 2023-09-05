var assert = require('assert');
const sequelize = require('../../src/config/database.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Review = require('../../src/models/review.js');
const app = require('../../src/app.js');

const { expect } = chai;
chai.use(chaiHttp);

describe('Review model', function (){
  
  before(async function() {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
    } catch (err) {
      console.error('Database error:', err);
    }
  });

  afterEach(async function() {
    // Delete all Review instances after each test.
    await Review.destroy({ where: {}});
  });

  it('creation method should return an instance', async function (){
    const watched_at = new Date('2023-09-17').setHours(0, 0, 0, 0);
    const barbieReview = await Review.createInstance('Barbie', 'movie', 8, 'An interesting movie', watched_at);

    assert.strictEqual(barbieReview.title, 'Barbie');
    assert.strictEqual(barbieReview.type, 'movie');
    assert.strictEqual(barbieReview.rating, 8);
    assert.strictEqual(barbieReview.opinion, 'An interesting movie');
    assert.strictEqual(new Date(barbieReview.watched_at).setHours(0, 0, 0, 0), watched_at);
  });

  it('creation method should create an instance in the database', async function (){
    // There are 0 instances of Reviews
    assert.equal(await Review.count(), 0);
    
    const watched_at = new Date('2023-09-17').setHours(0, 0, 0, 0);
    await Review.createInstance('Barbie', 'movie', 8, 'An interesting movie', watched_at);
  
    // A new review instance has been created
    assert.equal(await Review.count(), 1);
  });

  it('creation method should fail if data has not the correct type', async function () {
    try {
      await Review.createInstance('Invalid', 'invalid', 5, 'An invalid review', new Date());
      assert.fail('Expected an error for invalid type, but no error was thrown');
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(error.errors[0].message, 'Value should be movie, anime or series');
    }
  });

  it('creation method should fail if rating is not in range', async function () {
    try {
      await Review.createInstance('Invalid', 'movie', 15, 'An invalid review', new Date());
      assert.fail('Expected an error for invalid type, but no error was thrown');
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
    }
  });

});

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
