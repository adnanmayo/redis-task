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


    // const data = await getTargetList();
    // console.log({data})

    return new Promise( (resolve, reject) => {
    
        id = Date.now();
        let url = targetBody.url
        let value = targetBody.value
        let maxAcceptsPerDay = targetBody.maxAcceptsPerDay
        let acceptGeoState = JSON.stringify(targetBody.accept.geoState.$in)
        let acceptHour = JSON.stringify(targetBody.accept.hour.$in)
        

        client.hmset(id, [
            'url', url,
            'value', value,
            'maxAcceptsPerDay', maxAcceptsPerDay,
            'acceptGeoState', acceptGeoState,
            'acceptHour', acceptHour,
        ], (err, reply) => {
            if (err) {
                reject(err)
            }
            resolve(targetBody)
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
            let i = 0;
            keys.forEach((l) => {
                client.hgetall(id[l], (e, o) => {
                    i++;
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
        let acceptGeoState = JSON.stringify(updateBody.accept.geoState.$in)
        let acceptHour = JSON.stringify(updateBody.accept.hour.$in)
        // make id the key and assign the id to the other Parameters
        client.hmset(TargetId, [
            'url', url,
            'value', value,
            'maxAcceptsPerDay', maxAcceptsPerDay,
            'acceptGeoState', acceptGeoState,
            'acceptHour', acceptHour,
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

        const targetFound =  false;

        getTargetList().then((data) => {
            let targets = data.targets
            targets.forEach(element => {
                console.log(element.data)
                
                const target =  element.data;

                const targetData = {
                    "url": "",
                    "value": "",
                    "maxAcceptsPerDay": 0,
                    "accept": {
                        "geoState": {
                            "$in": []
                        },
                            "hour": {
                            "$in": [ ]
                            }
                    }
                }
                if(element.data.acceptGeoState.includes(requestBody.geoState)
                     && element.data.maxAcceptsPerDay > 0 && !targetFound ) {
                    targetData['accept']['geoState']['$in'] = JSON.parse(target['acceptGeoState']);
                    targetData['accept']['hour']['$in'] = JSON.parse(target['acceptHour']);
                    targetData['maxAcceptsPerDay'] =  target['maxAcceptsPerDay']-1;
                    targetData['url'] = target['url'];
                    targetData['value'] = target['value'];
                    updateTargetById(element.id, targetData).then((data) => {
                        targetFound =  true;
                        resolve(data);
                    })
                }
            });

            if(!targetFound){
            reject(new ApiError(httpStatus.NOT_FOUND, 'Target not found'));

            }



        })
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
