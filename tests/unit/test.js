var assert = require('assert');
const sequelize = require('../../src/config/database.js');
const { Op } = require("sequelize");
const Review = require('../../src/models/review.js');
const { createReview, getAllReviews, getReview } = require('../../src/controllers/review.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');

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

describe('Review controllers', function () {
  describe('createReview', function () {
    it('should create a new review', async function () {
      // Create a fake request and a fake response
      const req = {
        body: {
          title: 'A test movie',
          type: 'movie',
          ranking: 8,
          opinion: 'A test opinion',
          watched_at: '2019-5-23'
        }
      }
      const res = {
        json: sinon.spy()
      }

      await createReview(req, res);

      // Check response review properties
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.be.an('object');
      expect(res.json.firstCall.args[0]).to.have.a.property('title').equal('A test movie');
    });
  });

  describe('getAllReviews', function () {
    it('should get all reviews', async function () {
      // Create a fake request and a fake response
      const req = {}
      const res = {
        json: sinon.spy()
      }

      // Mock Review.findAll() method
      var stub = sinon.stub(Review, 'findAll');
      stub.returns(['Review 1', 'Review 2']);

      await getAllReviews(req, res);

      // Check response array properties
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.be.an('array');
      expect(res.json.firstCall.args[0]).to.have.lengthOf(2);

      stub.restore();
    });

    it('should search for records by name', async function () {
      const req = {
          query: {
              name: 'ExampleName'
          },
      };
      const res = {
          json: sinon.spy()
      };

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'ExampleName' }]);

      await getAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.title[Op.substring]).to.equal('ExampleName');

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([{ id: 1, title: 'ExampleName' }]);

      findAllStub.restore();
  });
  });

  describe('getReview', function () {
    it('should get a review by its id', async function () {
      // Create a fake request and a fake response
      const req = {
        params: {
          id: 3
        }
      }
      const res = {
        json: sinon.spy()
      }

      // Mock Review.findByPk() method
      var stub = sinon.stub(Review, 'findByPk')
      stub.returns('Review_3');

      await getReview(req, res);

      // Check response
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall).to.be.an('object');
      expect(res.json.firstCall.args[0]).to.deep.equal('Review_3');

      // Check if stub has been called with correct arguments
      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(3)).to.be.true;

      stub.restore();
    });
  });
});

