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
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);

      let imageUrl = '';
      if (files?.image) {
        const uploadResult = await cloudinary.v2.uploader.upload(files.image.filepath, {
          folder: 'schools',
        });
        imageUrl = uploadResult.secure_url;
      }

      const newSchool = await School.create({
        name: fields.name || '',
        address: fields.address || '',
        city: fields.city || '',
        state: fields.state || '',
        contact: fields.contact || '',
        email: fields.email || '',
        image: imageUrl,
      });

      return res.status(201).json(newSchool);
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      const schools = await School.find({});
      return res.status(200).json(schools);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch schools' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
