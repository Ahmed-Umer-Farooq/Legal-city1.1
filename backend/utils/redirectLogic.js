const getRedirectPath = (userData) => {
  // Priority 1: Custom redirect
  if (userData.redirect) {
    return userData.redirect;
  }

  // Priority 2: Admin check
  if (userData.is_admin === true || userData.is_admin === 1 || userData.role === 'admin') {
    return '/admin-dashboard';
  }

  // Priority 3: Lawyer check
  if (userData.role === 'lawyer' || userData.registration_id) {
    return '/lawyer-dashboard';
  }

  // Priority 4: Default user
  return '/user-dashboard';
};

module.exports = { getRedirectPath };