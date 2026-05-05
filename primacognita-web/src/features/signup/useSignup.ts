import { useCallback, useState } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { SignupRequest } from '@/modules/signup/domain/SignupRequest';
import { validateSignupForm, type FieldErrors } from './signup.utils';

interface UseSignupState {
  isLoading: boolean;
  globalError: string | null;
  fieldErrors: FieldErrors;
}

interface UseSignupResult extends UseSignupState {
  signup: (values: SignupRequest & { email2: string }) => Promise<boolean>;
}

export function useSignup(): UseSignupResult {
  const { signupRepository } = useDependencies();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const signup = useCallback(
    async (values: SignupRequest & { email2: string }): Promise<boolean> => {
      setGlobalError(null);
      setFieldErrors({});

      const errors = validateSignupForm(values);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return false;
      }

      setIsLoading(true);
      try {
        const { email2: _email2, ...request } = values;
        const response = await signupRepository.signup(request);

        if (!response.ok) {
          if (response.fieldErrors) {
            const mapped: FieldErrors = {};
            for (const [key, msg] of Object.entries(response.fieldErrors)) {
              mapped[key as keyof FieldErrors] = [msg];
            }
            setFieldErrors(mapped);
          }
          if (response.globalError) setGlobalError(response.globalError);
          return false;
        }

        return true;
      } catch (e) {
        setGlobalError(e instanceof Error ? e.message : 'Error desconocido');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [signupRepository],
  );

  return { isLoading, globalError, fieldErrors, signup };
}
