import homeController from '../controllers/homeController';
import apiController from '../controllers/apiController';
import authController from '../controllers/authController';
import helper from './routeHelper';

export default {
    init: initRoutes
};

function initRoutes(app) {
    helper.init(app);

    helper.get('/api/current-user', apiController.getCurrentUser);

    helper.get('/api/categories', apiController.categoriesList);
    helper.post('/api/category', apiController.saveCategory);
    helper.delete('/api/category/:id', apiController.deleteCategory);

    helper.get('/api/records', apiController.recordsList);
    helper.post('/api/record', apiController.saveRecord);
    helper.delete('/api/record/:id', apiController.deleteRecord);

    helper.post('/api/sign-up', authController.signUpPost, {auth: false});
    helper.post('/api/login', authController.loginPost, {auth: false});
    helper.post('/api/logout', authController.logOut, {auth: false});
    helper.post('/api/password-forgot', authController.forgotPassword, {auth: false});
    helper.get('/api/password-reset/:token', authController.resetPassword, {auth: false});
    helper.post('/api/password-reset', authController.resetPasswordPost, {auth: false});
    helper.get('/api/activate/:token', authController.activate, {auth: false});

    //all other routes are rendered as home (for client side routing)
    helper.get('*', homeController.home, {auth: false});
}