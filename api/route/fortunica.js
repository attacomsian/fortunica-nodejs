const user = require('../controller/user');
const client = require('../controller/client');
const question = require('../controller/question');
const answer = require('../controller/answer');
const notification = require('../controller/notification');

const jwtVerify = require('../middleware/jwt-auth');

module.exports = (app, express) => {
    //get router
    var router = express.Router();

    //user sign up and login
    router.route('/user/signup')
        .post(user.signup);

    router.route('/user/login')
        .post(user.login);

    //client.js sign up and login
    router.route('/client.js/signup')
        .post(client.signup);

    router.route('/client.js/login')
        .post(client.login);

     // JWT Middleware - TOKEN based authentication
    router.use(jwtVerify);

    //get all user (aka experts)
    router.route('/user/list')
        .get(user.list);

    // get all user questions
    router.route('/user/questions')
        .get(question.userQuestions);

    // get all client.js questions
    router.route('/client.js/questions')
        .get(question.clientQuestions);

    // save and get question
    router.route('/question/:id?')
        .post(question.saveQuestion)
        .get(question.getQuestion);

    // get all user answers
    router.route('/user/answers')
        .get(answer.userAnswers);

    // save and get answer
    router.route('/answer/:id?')
        .post(answer.saveAnswer)
        .get(answer.getAnswer);

    //push notification subscription
    router.route('/push/subscribe')
        .post(notification.subscribe);

    //apply /api/v1 prefix to all routes
    app.use('/api/v1', router);
};