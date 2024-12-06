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

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Contacts';

// Create Contact
app.post('/api/contact', async (req, res) => {
  try {
    const contact = {
      id: Date.now().toString(),
      ...req.body
    };
    
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: contact
    }).promise();

    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Get All Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const data = await dynamoDB.scan({
      TableName: TABLE_NAME
    }).promise();
    
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update Contact
app.put('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    // First check if the item exists
    const existingItem = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise();

    if (!existingItem.Item) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const data = await dynamoDB.update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set #n = :name, email = :email, phone = :phone, address = :address',
      ExpressionAttributeNames: {
        '#n': 'name'  // 'name' is a reserved word in DynamoDB
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':phone': phone,
        ':address': address
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(id)'  // Ensure the item exists
    }).promise();

    res.json(data.Attributes);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  }
});

// Delete Contact
app.delete('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the item exists
    const existingItem = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise();

    if (!existingItem.Item) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await dynamoDB.delete({
      TableName: TABLE_NAME,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)'
    }).promise();

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  }
});

const port = 5002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('AWS Configuration:', {
    region: awsConfig.region,
    accessKeyId: awsConfig.accessKeyId ? 'Set' : 'Not Set',
    secretAccessKey: awsConfig.secretAccessKey ? 'Set' : 'Not Set',
    sessionToken: awsConfig.sessionToken ? 'Set' : 'Not Set'
  });
});