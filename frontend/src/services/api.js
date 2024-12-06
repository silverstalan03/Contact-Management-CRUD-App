import axios from 'axios';

const API_URL = 'http://backend:5002/api';

export const getContacts = () => 
  axios.get(`${API_URL}/contacts`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching contacts:', error);
      throw error;
    });

export const addContact = (contact) => 
  axios.post(`${API_URL}/contact`, contact)
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding contact:', error);
      throw error;
    });

export const updateContact = (id, contact) => 
  axios.put(`${API_URL}/contact/${id}`, contact)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating contact:', error);
      throw error;
    });

export const deleteContact = (id) => 
  axios.delete(`${API_URL}/contact/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting contact:', error);
      throw error;
    });