import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('https://fitwithme.onrender.com/clients/?format=json')
      .then(response => {
        console.log('Fetched clients:', response.data); // Debugging line
        setClients(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Clients</h1>
      <ul>
      <h1>Hello</h1>
        {clients.map(client => (
          <li key={client.id}>
            <Link to={`/client/${client.id}/progress`}>{client.full_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;