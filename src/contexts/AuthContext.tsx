// Add company_id to your existing AuthContext login function
const login = async (email: string, password: string) => {
  // Your existing login logic...
  const user = await response.json();
  
  // AUTO-ASSIGN COMPANY BY EMAIL
  if (email === 'mattcoombes247@gmail.com') {
    user.company_id = 'global';
    user.role = 'superadmin';
  } else if (email.includes('forge-academy.com')) {
    user.company_id = 'forge-academy';
  }
  
  setCurrentUser(user);
};
