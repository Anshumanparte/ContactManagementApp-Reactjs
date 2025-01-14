
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dumhtpl9f/upload';
const CLOUDINARY_PRESET = 'contacts_app_images';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', email: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentpage, setCurrentpage] = useState(1)
  const [postperpage, setPostperpage] = useState(6)

  

  
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(storedContacts);
  }, []);

  
  const saveToLocalStorage = (updatedContacts) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  
  const uploadImage = async () => {
    if (!imageFile) return '';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage();
    const updatedFormData = { ...formData, imageUrl: imageUrl || formData.imageUrl };

    const updatedContacts = formData.id
      ? contacts.map((contact) => (contact.id === formData.id ? updatedFormData : contact))
      : [...contacts, { ...updatedFormData, id: Date.now().toString() }];

    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts);
    setFormData({ id: '', name: '', phone: '', email: '', imageUrl: '' });
    setImageFile(null);
  };


  
  const handleEdit = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    setFormData(contactToEdit);
  };

  
  const handleDelete = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts);
  };

  const lastpageindex= currentpage * postperpage;
  const firstpageindex= lastpageindex - postperpage;
  const contactData = contacts.slice(firstpageindex,lastpageindex)


  return (
    <div className="app-container bg-gray-100 min-h-screen flex flex-col  items-center p-4">
      <div className='text-center'>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Contact Management App</h1>
        <form onSubmit={handleFormSubmit} className="contact-form w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            {formData.id ? 'Update' : 'Add'} Contact
          </button>
        </form>

      </div>
      <div className='mt-5'>

        <button 
        className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 mr-2'

        onClick={()=>{
          if(currentpage>1 ){
            setCurrentpage(currentpage-1)
          }
        }}>Prev</button>

        {`<${currentpage}>....<${Math.ceil(contacts.length/postperpage) || 1}>`}


        <button 
         className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 mr-2'
        onClick={()=>{
          if(currentpage < Math.ceil(contacts.length/postperpage) ){
            setCurrentpage(currentpage+1)
          }
        }}>Next</button>

      </div>

      <div className="contact-list md:grid md:grid-cols-3  gap-4 mt-6 w-full max-w-8xl flex flex-col  ">
        {contactData.map((contact) => (
          <div key={contact.id} className="contact-item bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-start">
            <div className="flex-1">
              <p className="text-gray-800 font-medium"><strong>Name:</strong> {contact.name}</p>
              <p className="text-gray-800"><strong>Phone:</strong> {contact.phone}</p>
              <p className="text-gray-800"><strong>Email:</strong> {contact.email}</p>
              {contact.imageUrl && <img src={contact.imageUrl} alt="Contact" className="contact-image w-32 h-32 object-cover rounded-md mt-2" />}
            </div>
            <div className="actions flex mt-4 md:mt-0 md:ml-4">
              <button
                onClick={() => handleEdit(contact.id)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
