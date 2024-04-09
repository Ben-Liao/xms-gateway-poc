// awsDynamoDBAccess.js
const AWS = require('aws-sdk');
const logger = require('../utils/logger');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
} = process.env;

// Initialize DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient({
  region: CXENGAGE_REGION, // Specify the AWS Region
});

const tableName = `${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-xms-poc`;

class DynamoDBAccess {
    static async queryRemainingCallResources(tenantInteractionID) {
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'TenantInteractionID = :tid',
            FilterExpression: 'begins_with(ResourceType#ResourceID, :rtype)',
            ExpressionAttributeValues: {
                ':tid': tenantInteractionID,
                ':rtype': 'CallResource',
            },
        };

        try {
            const data = await docClient.query(params).promise();
            return data.Items;
        } catch (err) {
            logger.error('Unable to query. Error:', JSON.stringify(err, null, 2));
            throw err;
        }
    }

    static async saveCallResource(tenantId, interactionId, callResourceId, otherAttributes = {}) {
        const item = {
            TenantInteractionID: `${tenantId}#Interaction#${interactionId}`,
            ResourceTypeResourceID: `CallResource#${callResourceId}`,
            TenantID: tenantId,
            InteractionID: interactionId,
            CallResourceID: callResourceId,
            ...otherAttributes,
        };

        const params = {
            TableName: tableName,
            Item: item,
        };

        try {
            await docClient.put(params).promise();
            logger.info('Call resource saved successfully:', item);
        } catch (err) {
            logger.error('Error saving call resource:', JSON.stringify(err, null, 2));
            throw err;
        }
    }

    static async addConferenceAndAssociateCalls(tenantId, interactionId, conferenceId, callResourceIds, otherAttributes = {}) {
        const conferenceItem = {
            TenantInteractionID: `${tenantId}#Interaction#${interactionId}`,
            ResourceTypeResourceID: `Conference#${conferenceId}`,
            TenantID: tenantId,
            InteractionID: interactionId,
            ConferenceID: conferenceId,
            ...otherAttributes,
        };

        const conferenceParams = {
            TableName: tableName,
            Item: conferenceItem,
        };

        try {
            await docClient.put(conferenceParams).promise();
            logger.info('Conference added successfully:', conferenceItem);
        } catch (err) {
            logger.error('Error adding conference:', JSON.stringify(err, null, 2));
            throw err;
        }

        for (const callResourceId of callResourceIds) {
            await this.saveCallResource(tenantId, interactionId, callResourceId, { ConferenceId: conferenceId, ...otherAttributes });
        }
    }
}

module.exports = DynamoDBAccess;
