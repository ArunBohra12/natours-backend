import { v2 as cloudinary } from 'cloudinary';

/**
 * Uploads an image to cloudinary
 * @param {*} imageUrl Url for the image to be uploaded
 * @param {string} publicId Unique identifier for the image
 * @param {string} uploadPreset Upload preset that you want to upload image to
 * @returns Array with status and data(error or success data)
 */
const uploadImage = async (imageUrl, publicId, uploadPreset) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      upload_preset: uploadPreset,
    });

    return [true, uploadResult];
  } catch (error) {
    return [false, error];
  }
};

export default uploadImage;
