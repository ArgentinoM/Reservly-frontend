const url = 'https://reservly-backend-production.up.railway.app';

export const environment = {
  production: true,
  url_base: `${url}/api`,
  url: `${url}`,
  register_endpoint: 'auth/register',
  verifyCode_endpoint: 'auth/verify',
  login_endpoint: 'auth/login',
  logout_endpoint: 'auth/logout',

  //categories
  getCategories_endpoint: 'categories',

  // Services
  getServices_endpoint: 'services',
  storeServices_endpoint: 'serviceStore',

  // Favorite
   getFavorite_endpoint: 'favoriteService',
   storeFavorite_endpoint: 'favoriteStore',
   deleteFavorite_endpoint: 'favoriteDelete',

  //Reviews
  getReviews_endpoint: 'review',
}
