import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData();
      
      // Append all form data
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key][0]) {
          formData.append('image', data[key][0]);
        } else if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('School added successfully!');
        reset();
      } else {
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 py-12">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-6">Add New School</h1>
          <Link href="/" className="text-blue-700 hover:text-blue-900 font-semibold">
            ← Back to Home
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* School Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">School Name *</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { 
                required: 'School name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address *</label>
            <textarea
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              {...register('address', { 
                required: 'Address is required',
                minLength: { value: 10, message: 'Address must be at least 10 characters' }
              })}
            />
            {errors.address && <p className="text-red-600 mt-1">{errors.address.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">City *</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('city', { 
                required: 'City is required',
                minLength: { value: 2, message: 'City must be at least 2 characters' }
              })}
            />
            {errors.city && <p className="text-red-600 mt-1">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">State *</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('state', { 
                required: 'State is required',
                minLength: { value: 2, message: 'State must be at least 2 characters' }
              })}
            />
            {errors.state && <p className="text-red-600 mt-1">{errors.state.message}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Contact Number *</label>
            <input
              type="tel"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('contact', { 
                required: 'Contact number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
            />
            {errors.contact && <p className="text-red-600 mt-1">{errors.contact.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email ID *</label>
            <input
              type="email"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">School Image *</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-blue-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('image', { 
                required: 'School image is required'
              })}
            />
            {errors.image && <p className="text-red-600 mt-1">{errors.image.message}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Upload an image file (JPG, PNG, GIF). Max size: 5MB
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-300"
            >
              {isSubmitting ? 'Adding School...' : 'Add School'}
            </button>
          </div>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            } mt-6`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}