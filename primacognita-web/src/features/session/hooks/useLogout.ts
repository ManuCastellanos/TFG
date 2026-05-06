import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { logoutUser } from '../logoutUser';

export const useLogout = () => {
  const dependencies = useDependencies();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    logoutUser(dependencies);
    navigate({ to: '/' });
  }, [dependencies, navigate]);

  return { logout };
};
