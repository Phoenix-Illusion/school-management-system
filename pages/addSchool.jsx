import dbConnect from '../../lib/dbConnect';
import School from '../../models/School';
import formidable from 'formidable';
import cloudinary from 'cloudinary';

// Disable Next.js default body parser (important for file upload)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to promisify formidable
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);

      let imageUrl = '';
      if (files.image) {
        const uploadResult = await cloudinary.v2.uploader.upload(files.image.filepath, {
          folder: 'schools',
        });
        imageUrl = uploadResult.secure_url;
      }

      const newSchool = await School.create({
        name: fields.name,
        address: fields.address,
        city: fields.city,
        state: fields.state,
        contact: fields.contact,
        email: fields.email,
        image: imageUrl,
      });

      return res.status(201).json(newSchool);
    } catch (error) {
      console.error('Error adding school:', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const schools = await School.find({});
      return res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
