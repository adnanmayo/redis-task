const Joi = require('joi');

const createTarget = {
  body: Joi.object().keys({
    url: Joi.string().required(),
    value: Joi.number().required(),
    maxAcceptsPerDay: Joi.number().required(),
    accept: Joi.object({
      geoState: Joi.array().items(Joi.string()),
      hour: Joi.array().items(Joi.string())
    })
  }),
};

const getTargets = {
};

const getTarget = {
  params: Joi.object().keys({
    // TargetId: Joi.string().custom(targetId),
  }),
};

const updateTarget = {
  params: Joi.object().keys({
    // TargetId: Joi.required().custom(targetId),
  }),
  body: Joi.object()
    .keys({
    })
    .min(1),
};

const deleteTarget = {
  params: Joi.object().keys({
    // TargetId: Joi.string().custom(targetId),
  }),
};

module.exports = {
  createTarget,
  getTargets,
  getTarget,
  updateTarget,
  deleteTarget,
};
