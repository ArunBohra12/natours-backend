/**
 * All upload presets for cloudinary
 */
export const UPLOAD_PRESETS = {
  profileImages: 'natours_profile_photos',
};

export const ADMIN = {
  roles: { viewer: 'viewer', editor: 'editor', admin: 'admin' },
  highestLevelAdmin: 'admin',
};

export const STRIPE_EVENTS = {
  CHECKOUT_SESSION_SUCCESS: 'checkout.session.completed',
};

// Currently only have option to use INR currency
export const STRIPE_CURRENCY = 'inr';
