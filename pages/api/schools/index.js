import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, address, city, state, contact, email, image } = req.body;

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
        'INSERT INTO schools (name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, image || null, email]
      );

      return res.status(201).json({
        message: 'School added successfully',
        schoolId: result.insertId,
      });
    } catch (error) {
      console.error('Error adding school:', error);
      return res.status(500).json({ error: 'Failed to add school' });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, address, city, state, contact, image, email FROM schools ORDER BY id DESC'
      );

      return res.status(200).json({ schools: rows });
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ error: 'Failed to fetch schools' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
