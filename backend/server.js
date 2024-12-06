const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure AWS
const awsConfig = {
    region: process.env.AWS_REGION || 'eu-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
};

// Add detailed AWS config logging
console.log('Full AWS Config:', {
    region: awsConfig.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...',
    secretKeySet: !!process.env.AWS_SECRET_ACCESS_KEY,
    tokenSet: !!process.env.AWS_SESSION_TOKEN
});

AWS.config.update(awsConfig);
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Contacts';

// Verify DynamoDB connection
const verifyDynamoDBConnection = async () => {
    try {
        await dynamoDB.scan({ TableName: TABLE_NAME, Limit: 1 }).promise();
        console.log('Successfully connected to DynamoDB');
    } catch (error) {
        console.error('DynamoDB connection error:', error);
    }
};

// Create Contact
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Creating contact:', req.body);
        const contact = {
            id: Date.now().toString(),
            ...req.body
        };
        
        await dynamoDB.put({
            TableName: TABLE_NAME,
            Item: contact
        }).promise();
        
        console.log('Contact created successfully:', contact);
        res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact:', {
            error: error.message,
            code: error.code,
            statusCode: error.statusCode,
            requestId: error.requestId
        });
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// Get All Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        console.log('Attempting to fetch contacts from table:', TABLE_NAME);
        const data = await dynamoDB.scan({
            TableName: TABLE_NAME
        }).promise();
        
        console.log('Successfully fetched contacts:', {
            count: data.Items?.length || 0
        });
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching contacts:', {
            error: error.message,
            code: error.code,
            statusCode: error.statusCode,
            requestId: error.requestId
        });
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Update Contact
app.put('/api/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        console.log('Updating contact:', { id, updates: req.body });

        // First check if the item exists
        const existingItem = await dynamoDB.get({
            TableName: TABLE_NAME,
            Key: { id }
        }).promise();

        if (!existingItem.Item) {
            console.log('Contact not found for update:', id);
            return res.status(404).json({ error: 'Contact not found' });
        }

        const data = await dynamoDB.update({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set #n = :name, email = :email, phone = :phone, address = :address',
            ExpressionAttributeNames: {
                '#n': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':email': email,
                ':phone': phone,
                ':address': address
            },
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(id)'
        }).promise();

        console.log('Contact updated successfully:', data.Attributes);
        res.json(data.Attributes);
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            console.error('Error updating contact:', {
                error: error.message,
                code: error.code,
                statusCode: error.statusCode,
                requestId: error.requestId
            });
            res.status(500).json({ error: 'Failed to update contact' });
        }
    }
});

// Delete Contact
app.delete('/api/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Attempting to delete contact:', id);

        // First check if the item exists
        const existingItem = await dynamoDB.get({
            TableName: TABLE_NAME,
            Key: { id }
        }).promise();

        if (!existingItem.Item) {
            console.log('Contact not found for deletion:', id);
            return res.status(404).json({ error: 'Contact not found' });
        }

        await dynamoDB.delete({
            TableName: TABLE_NAME,
            Key: { id },
            ConditionExpression: 'attribute_exists(id)'
        }).promise();

        console.log('Contact deleted successfully:', id);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            console.error('Error deleting contact:', {
                error: error.message,
                code: error.code,
                statusCode: error.statusCode,
                requestId: error.requestId
            });
            res.status(500).json({ error: 'Failed to delete contact' });
        }
    }
});

// Start server and verify DynamoDB connection
const port = 5002;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('AWS Configuration:', {
        region: awsConfig.region,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set',
        sessionToken: process.env.AWS_SESSION_TOKEN ? 'Set' : 'Not Set'
    });
    
    // Verify DynamoDB connection on startup
    verifyDynamoDBConnection();
});