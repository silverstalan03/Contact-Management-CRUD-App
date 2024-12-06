const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Contact = mongoose.model('Contact', {
  id: String,
  name: String,
  email: String,
  phone: String,
  address: String
});

app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact({
      id: Date.now().toString(),
      ...req.body
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.put('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ id: req.params.id });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));
