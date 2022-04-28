const httpStatus = require('http-status');
const { Target } = require('../models');
const ApiError = require('../../utils/ApiError');
const redis = require('redis');
const client = redis.createClient();
const { v4: uuidv4 } = require('uuid')

/**
 * Create a Target
 * @param {Object} targetBody
 * @returns {Promise<Target>}
 */
const createTarget = async (targetBody) => {
    return new Promise((resolve, reject) => {
        let id = uuidv4()
        let url = targetBody.url
        let value = targetBody.value
        let maxAcceptsPerDay = targetBody.maxAcceptsPerDay
        let accept = targetBody.accept
        
        client.hmset(id, [
            'url', url,
            'value', value,
            'maxAcceptsPerDay', maxAcceptsPerDay,
            'accept', accept
        ], (err, reply) => {
            if (err) {
                reject(err)
            }
            resolve(reply)
        })
    })
}

/**
 * Get Target List
 * @returns {Promise<Target>}
 */
const getTargetList = async () => {
    return new Promise((resolve, reject) => {
        let return_dataset = []
        client.keys('*', (err, id) => {
            // let multi = client.multi()
            let keys = Object.keys(id)
            let i = 0
            keys.forEach((l) => {
                client.hgetall(id[l], (e, o) => {
                    i++
                    if (e) { reject(e) } else {
                        temp_data = { 'id': id[l], 'data': o }
                        return_dataset.push(temp_data)
                    }
                    if (i == keys.length) {
                        resolve({ targets: return_dataset })
                    }
                })
            })
        })
    })
}

/**
 * Get Target by id
 * @param {ObjectId} id
 * @returns {Promise<Target>}
 */
const getTargetById = async (id) => {
    return new Promise((resolve, reject) => {
        let result = []
        // get all values associated with the key as id
        client.hgetall(id, (err, obj) => {
            if (err) {
                reject(err);
            }
            resolve(obj);
        })
    })
}

/**
 * Update Target by id
 * @param {ObjectId} TargetId
 * @param {Object} updateBody
 * @returns {Promise<Target>}
 */
const updateTargetById = async (TargetId, updateBody) => {
    return new Promise((resolve, reject) => {
        let url = updateBody.url
        let value = updateBody.value
        let maxAcceptsPerDay = updateBody.maxAcceptsPerDay
        let accept = updateBody.accept

        // make id the key and assign the id to the other Parameters
        client.hmset(TargetId, [
            'url', url,
            'value', value,
            'maxAcceptsPerDay', maxAcceptsPerDay,
            // 'accept', accept
        ], (err, reply) => {
            if (err) {
                reject(err)
            }
            resolve(reply)
        })
    })
}

/**
 * Delete Target by id
 * @param {ObjectId} TargetId
 * @returns {Promise<Target>}
 */
const deleteTargetById = async (TargetId) => {
    return new Promise((resolve, reject) => {
        return client.del(TargetId, (err, reply) => {
            if (err) {
                reject(err)
            }
            resolve(reply)
        })
    })
}


/**
 * Make decision for visitor
 * @param {Object} requestBody
 * @returns {Promise<Target>}
 */
const makeDecision = async (requestBody) => {
    return new Promise((resolve, reject) => {


    })
}

module.exports = {
    createTarget,
    getTargetList,
    getTargetById,
    updateTargetById,
    deleteTargetById,
    makeDecision
};
