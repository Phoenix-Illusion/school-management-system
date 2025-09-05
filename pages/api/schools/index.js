import pool from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // large file uploads
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, address, city, state, contact, email, imageBase64 } = req.body;

      if (!name || !address || !city || !state || !contact || !email) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Upload image to Cloudinary (if given)
      let imageUrl = null;
      if (imageBase64) {
        const uploadRes = await cloudinary.uploader.upload(imageBase64, {
          folder: "schools",
        });
        imageUrl = uploadRes.secure_url;
      }

      const [result] = await pool.execute(
        'INSERT INTO schools (name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, imageUrl, email]
      );

      res.status(201).json({
        message: 'School added successfully',
        schoolId: result.insertId,
      });
    } catch (error) {
      console.error('Error adding school:', error);
      res.status(500).json({ error: 'Failed to add school' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, address, city, state, contact, image, email FROM schools ORDER BY id DESC'
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
