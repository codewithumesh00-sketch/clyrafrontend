import { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User,
  signOut 
} from 'firebase/auth';
import { app } from '@/firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
  };

  return { user, loading, logout };
};