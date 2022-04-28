const request = require("request");
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { targetService } = require('../services');

const createTarget = catchAsync(async (req, res) => {
    await targetService.createTarget(req.body)
        .then(target => res.status(httpStatus.CREATED).send(target))
        .catch(e => 
            {
                console.log(e);
                new ApiError(httpStatus.NOT_FOUND, 'targets not found')
        })
})

const getTargets = catchAsync(async (req, res) => {
    await targetService.getTargetList(req, res)
        .then(result => res.status(httpStatus.OK).send(result))
        .catch(e => new ApiError(httpStatus.NOT_FOUND, 'targets not found'))
})

const getTarget = catchAsync(async (req, res) => {
    await targetService.getTargetById(req.params.targetId)
        .then(target => res.status(httpStatus.OK).send({ target: target }))
        .catch(e => new ApiError(httpStatus.NOT_FOUND, 'target not found'))
})

const updateTarget = catchAsync(async (req, res) => {
    await targetService.updateTargetById(req.params.targetId, req.body)
        .then(() => res.status(httpStatus.UPDATED).send())
        .catch(e => new ApiError(httpStatus.NOT_FOUND, 'target not found'))
})

const deleteTarget = catchAsync(async (req, res) => {
    await targetService.deleteTargetById(req.params.targetId)
        .then(() => res.status(httpStatus.OK).send())
        .catch(e => new ApiError(httpStatus.NOT_FOUND, 'target not found'))
});

const makeDecision = catchAsync(async (req, res) => {
    await targetService.makeDecision(req.body)
        .then(() => res.status(httpStatus.OK).send())
        .catch(e => new ApiError(httpStatus.NOT_FOUND, 'target not found'))
});

module.exports = {
    createTarget,
    getTargets,
    getTarget,
    updateTarget,
    deleteTarget,
    makeDecision,
};
