import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, failure} from './libs/response-lib';

export async function main(event, context, callback){
    console.log(event.requestContext);
    console.log(event.requestContext.identity.cognitoIdentityId);
    const params = {
        TableName: 'movies',
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    }
    try{
        const result = await dynamoDbLib.call("query", params);
        console.log(result);
        callback(null, success(result));
    }
    catch(e){
        console.log(e);
        callback(null, failure({status: false}));
    }
}