
const express = require('express');
const targetController = require('../controllers/target.controller');
const validate = require('../middlewares/validate');
const targetValidation = require('../../validations/target.validation');

const router = express.Router();

router
    .route('/targets')
    // .post(validate(targetValidation.createTarget),targetController.createTarget)
    .post(targetController.createTarget)
    .get(targetController.getTargets)


router
    .route('/targets/:targetId')
    .get(targetController.getTarget)
    .patch(targetController.updateTarget)
    .delete(targetController.deleteTarget)

    // router
    // .route('/targets')
    // .get(targetController.getTargets)
    // .patch(targetController.updateTarget)
    // .delete(targetController.deleteTarget)


router
    .route('/route')
    .post(targetController.makeDecision)





module.exports = router;