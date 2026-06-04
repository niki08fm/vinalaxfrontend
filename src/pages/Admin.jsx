import { useState } from 'react';
import '../styles/main.css';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setStatus('Logging in...');

    try {
      const res = await fetch('https://vinalaxbackend.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        setStatus('Login failed');
        return;
      }

      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        setStatus('Login successful');
        loadBookings(data.token);
      } else {
        setStatus('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setStatus('Network error during login');
    }
  };

  const loadBookings = async jwtToken => {
    setStatus('Loading bookings...');
    try {
      const res = await fetch('https://vinalaxbackend.onrender.com/api/bookings', {
        headers: { Authorization: 'Bearer ' + jwtToken }
      });

      if (!res.ok) {
        setStatus('Error loading bookings');
        return;
      }

      const data = await res.json();
      setBookings(data);
      setStatus('Bookings loaded');
    } catch (err) {
      console.error(err);
      setStatus('Network error while loading bookings');
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p className="status">{status}</p>

      {token && (
        <>
          <h2>All Bookings</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Service</th><th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.full_name}</td>
                  <td>{b.email}</td>
                  <td>{b.phone}</td>
                  <td>{b.company_name}</td>
                  <td>{b.service_type}</td>
                  <td>{b.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Admin;
