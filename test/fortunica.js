const mongoose = require("mongoose");
const User = require('../api/models/user');
const Client = require('../api/models/client');
const Question = require('../api/models/question');
const Answer = require('../api/models/answer');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

const userData = {
    name: 'Erik Derr',
    email: 'erik@derr.com',
    password: '123@abc'
};

const clientData = {
    name: 'Michael Backes',
    email: 'hi@backes.com',
    password: '123@abc'
};

let userToken = '';
let clientToken = '';
let userId = '';
let clientId = '';
let questionId = '';

describe('Users', () => {
    before((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    describe('/POST signup', () => {
        it('it should create a user account ', (done) => {
            chai.request(server)
                .post('/api/v1/user/signup')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User added.');
                    //save _id for later use
                    this.userId = res.body.user._id;
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('it should login user', (done) => {
            chai.request(server)
                .post('/api/v1/user/login')
                .send({email: userData.email, password: userData.password})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    //save token for later use
                    this.userToken = res.body.token;
                    done();
                });
        });
    });

    describe('/GET list', () => {
        it('it should list all users (aka experts)', (done) => {
            chai.request(server)
                .get('/api/v1/user/list')
                .set('x-access-token', this.userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});

describe('Clients', () => {
    before((done) => {
        Client.remove({}, (err) => {
            done();
        });
    });

    describe('/POST signup', () => {
        it('it should create a client account ', (done) => {
            chai.request(server)
                .post('/api/v1/client/signup')
                .send(clientData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Client added.');
                    //save _id for later use
                    this.clientId = res.body.client._id;
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('it should login client', (done) => {
            chai.request(server)
                .post('/api/v1/client/login')
                .send({email: clientData.email, password: clientData.password})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    //save token for later use
                    this.clientToken = res.body.token;
                    done();
                });
        });
    });
});

describe('Questions', () => {
    before((done) => {
        Question.remove({}, (err) => {
            done();
        });
    });

    describe('/POST and /GET question', () => {
        it('it should add a new question and then retrieve it', (done) => {
            const question = {
                content: 'Can I asked a question?',
                user: this.userId
            };
            chai.request(server)
                .post('/api/v1/question')
                .set('x-access-token', this.clientToken)
                .send(question)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Question added.');
                    res.body.should.have.property('question').property('content').eql(question.content);

                    this.questionId = res.body.question._id;

                    //follow up with question retrieval
                    chai.request(server)
                        .get('/api/v1/question/' + this.questionId)
                        .set('x-access-token', this.clientToken)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('content').eql(question.content);
                            res.body.should.have.property('_id').eql(this.questionId);
                            done();
                        });
                });
        });
    });

    describe('/GET user questions', () => {
        it('it should list all questions asked from a user', (done) => {
            chai.request(server)
                .get('/api/v1/user/questions')
                .set('x-access-token', this.userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET client questions', () => {
        it('it should list all questions asked by a client', (done) => {
            chai.request(server)
                .get('/api/v1/client/questions')
                .set('x-access-token', this.clientToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});


describe('Answers', () => {
    before((done) => {
        Answer.remove({}, (err) => {
            done();
        });
    });

    describe('/POST and /GET answer', () => {
        it('it should add a new answer and then retrieve it', (done) => {
            const answer = {
                content: 'Please send me a message.',
                question: this.questionId
            };
            chai.request(server)
                .post('/api/v1/answer')
                .set('x-access-token', this.userToken)
                .send(answer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Answer added.');
                    res.body.should.have.property('answer').property('content').eql(answer.content);

                    const answerId = res.body.answer._id;

                    //follow up with answer retrieval
                    chai.request(server)
                        .get('/api/v1/answer/' + answerId)
                        .set('x-access-token', this.userToken)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('content').eql(answer.content);
                            res.body.should.have.property('_id').eql(answerId);
                        });
                        done();
                });
        });
    });

    describe('/GET user answers', () => {
        it('it should list all answers added by a user', (done) => {
            chai.request(server)
                .get('/api/v1/user/answers')
                .set('x-access-token', this.userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});