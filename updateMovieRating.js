import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, failure} from './libs/response-lib';

export async function main(event, context, callback){
    const data = JSON.parse(event.body);
    const params = {
        Tablename: 'movies',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            movieId: event.pathParameters.id
        },
        UpdateExpression: 'SET movieRating =:movieRating',
        ExpressionAttributeValues:{
            ':movieRating': data.movieRating ? data.movieRating : null
        },
        ReturnValues: 'ALL_NEW'
    }
    try{
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({status: true}));
    }
    catch(e){
        callback(null, failure({status: false}));
    }
}