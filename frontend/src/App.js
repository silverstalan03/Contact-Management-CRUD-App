import React, { useState, useEffect } from 'react';
import { getContacts, addContact, updateContact, deleteContact } from './services/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("https://images.unsplash.com/photo-1557683311-eac922347aa1")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      fontSize: '2.5em',
      marginBottom: '30px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    },
    createButton: {
      padding: '12px 24px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%',
      marginBottom: '20px',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    contactCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '15px'
    },
    actionButton: {
      padding: '8px 16px',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '10px',
      transition: 'all 0.3s'
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing && editId) {
        await updateContact(editId, formData);
      } else {
        await addContact(formData);
      }
      fetchContacts();
      resetForm();
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address
    });
    setEditing(true);
    setEditId(contact.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteContact(id);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', address: '' });
    setEditing(false);
    setEditId(null);
    setShowForm(false);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Contact Management</h1>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: 'blue',
          color: '#c62828',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={styles.createButton}
        >
          Create Contact
        </button>
      )}

      {showForm && (
        <div style={styles.formContainer}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>
              {editing ? 'Edit Contact' : 'Create Contact'}
            </h2>
            <button
              onClick={resetForm}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              style={styles.input}
            />
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                backgroundColor: editing ? '#3498db' : '#27ae60'
              }}
            >
              {editing ? 'Update Contact' : 'Create Contact'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Contacts List</h2>
        {loading && (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Loading...
          </div>
        )}
        {!loading && contacts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No contacts yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {contacts.map(contact => (
              <div key={contact.id} style={styles.contactCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{contact.name}</h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      Phone: {contact.phone}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      Email: {contact.email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      Address: {contact.address}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(contact)}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: '#3498db'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: '#e74c3c'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
