const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let contacts = [];

// CRUD endpoints
app.post('/api/contact', (req, res) => {
  try {
    const contact = { id: Date.now().toString(), ...req.body };
    contacts.push(contact);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.put('/api/contact/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = contacts.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    contacts[index] = { ...contacts[index], ...req.body };
    res.json(contacts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contact/:id', (req, res) => {
  try {
    const { id } = req.params;
    contacts = contacts.filter(c => c.id !== id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));