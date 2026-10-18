import api from '../services/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

const AUTH_USER_KEY = 'valyou_auth_user';
const AUTH_TOKEN_KEY = 'valyou_auth_token';

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Connect to Google Cloud Run backend API
      const response = await api.post('/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        const userData: User = {
          id: response.data.user?.id || 'usr_' + Date.now(),
          email: response.data.user?.email || email,
          name: response.data.user?.firstName || email.split('@')[0],
          firstName: response.data.user?.firstName,
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      console.error('Backend login error:', err);
      const serverMessage = err.response?.data?.message;
      return { 
        success: false, 
        error: serverMessage || 'Invalid email or password. Please try again.' 
      };
    }
  },

  async register(data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    phoneNumber?: string 
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Connect to Google Cloud Run backend API
      const response = await api.post('/register', data);
      
      if (response.data && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        const userData: User = {
          id: response.data.user?.id || 'usr_' + Date.now(),
          email: response.data.user?.email || data.email,
          name: `${data.firstName} ${data.lastName}`.trim(),
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      console.error('Backend register error:', err);
      const serverMessage = err.response?.data?.message;
      return { 
        success: false, 
        error: serverMessage || 'Registration failed. User may already exist.' 
      };
    }
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(AUTH_USER_KEY);
    return Boolean(token && user);
  },
};

export default authService;
