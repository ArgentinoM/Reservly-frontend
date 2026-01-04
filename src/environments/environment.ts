const url = 'https://reservly-backend-production.up.railway.app';

export const environment = {
  production: true,
  url_base: `${url}/api`,
  url: `${url}`,
  register_endpoint: 'auth/register',
  verifyCode_endpoint: 'auth/verify',
  login_endpoint: 'auth/login',
  logout_endpoint: 'auth/logout',
  stripe_pk: 'pk_test_51SLzpdBnVjSuQRAIlKwI5w62gu6MsqHpaQh2MCKiEU7V0tsMdpF0SHxCmolBSpjwF8HyEwcG3iwutRoVTbTBMRyA00B03P4ihw',

  // User
  user_endpoint: 'users',

  //categories
  getCategories_endpoint: 'categories',

  // Services
  services_endpoint: 'services',

  // Favorite
  favorite_endpoint: 'favorites',

  //Reviews
  reviews_endpoint: 'reviews',

  // Payments
  payments_endpoint: 'payment_intents',
}
