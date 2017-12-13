import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, failure} from './libs/response-lib';

export async function main(event, context, callback){
    const data = JSON.parse(event.body);
    console.log(data);

    const params = {
        TableName: 'movies',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            movieId: parseInt(data.movieId)
        }
    }

    try {
        const result = await dynamoDbLib.call('delete', params);
        callback(null, success({status: true}));
    } catch(e){
        callback(null, failure({Status: false}));
    }
}