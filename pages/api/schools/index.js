import pool from '@/lib/db';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, address, city, state, contact, email } = req.body;

      // Validation
      if (!name || !address || !city || !state || !contact || !email) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(contact)) {
        return res.status(400).json({ error: 'Contact number must be 10 digits' });
      }

      // Insert into database
      const [result] = await pool.execute(
        'INSERT INTO schools (name, address, city, state, contact, email) VALUES (?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, email]
      );

      res.status(201).json({ 
        message: 'School added successfully',
        schoolId: result.insertId 
      });
    } catch (error) {
      console.error('Error adding school:', error);
      res.status(500).json({ error: 'Failed to add school' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, address, city, state, contact, email FROM schools ORDER BY id DESC'
      );
      
      res.status(200).json({ schools: rows });
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
