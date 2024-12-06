const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure AWS
const awsConfig = {
  region: 'eu-west-1',
  AWS_ACCESS_KEY_ID=ASIATUYJP7SUIGNS2WPO
  AWS_SECRET_ACCESS_KEY=WP5TtYq1inJaLexdcd0YLnkA00nI2K9dsc4OxXa/
  AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjEGUaCXVzLWVhc3QtMSJHMEUCIQDzP8B+UVndJFnCv/nLjR8biUGdQYoIYsh0Hj9mv14QvwIgPjyYMpEsyA/uh7LjSgnc2EVe8SuQJ/4bAibs50C7dkUq+wMIHRADGgwyNTA3Mzg2Mzc5OTIiDErNzTeAINT3VwmU7irYAxdIgMEg+0wBr9prbr3EEV027QvKpEEQG3dKiE804SnzrSULpsNjsyzySajngIFoLwMO0Ms2ClChH6iJiHB67hOgP4niQhm4pSN/JZHJvd8ibgrtSbJtDAQsVSyDhuhHkaCLPkLlGO3d4mLEgxnZwv7BXuOxfT4ZJ4IzTF8K6EW96PrBV7ionpkLATlGi3ZM6YuwnfnZeXIhAELQF7ylgYRnWkfTZdNjakn5JJHwR6cjhzuTBQzVqFpjtDi8LdCcr7Tw4/OuXRjE4Sh+md8+H7ndvY/0eONMJzLzHYf3BeYD5n0of9Zz4drfiSt5gEtuy4mooeku9hsHxr9GROdC1WIQ73kIp4aAHdvKO0sVmf3KNPhssW4kXF8GZ2Dalz5JCQF77WUfX6d3qGC+K+9kg0Us9pw0hpDcS00DitOxMMewHqhhLEAQLIql6mbm8FYzaZfRJ3VcNSxFxwFOZ5QxGs8p8NI7uq+/fdJ9IfBeBtIyT1yuj4l5xRO4S9a4UurNM2QZGiJHRoPnsNx0gX4Ocp6g/+zGsAxr/MZp/XhvLA4ikBa/TN7wDFFvCbWQE/OA34j06hU12HxrpKtnsQkezi7dNsAg0XKpQPuKb/CKEpmQ5kZ5Uca04mgwlZLIugY6pgHFd7O6dk2bwGuxSZtwlcwd3p+Tdwb2/eqwO/GhIactEeoU1tjH1HgTedKAuFgfgqEbEXoV06iKhgNfUdOGi4/Oadzj4rATG4JS9OtmX5H4fWvmWn4bdnPvgv9BAxHE+RCxaSMRJYMT86yasgkWccSVKZ68E59kR8uRMDO4hgup1hZ2/vrp7bixI3laE9hRm8sZy6DhCxPBCY1aYnxURXu9kgko53yn
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