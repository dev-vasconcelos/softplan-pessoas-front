import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from 'hooks/auth';
import { setLocale } from 'yup';

import errorMessages from 'utils/locales/pt-br/errorMessages.json';

function MyApp({ Component, pageProps }: AppProps) {
  setLocale({
    mixed: {
      required: errorMessages.requiredField,
      notType: errorMessages.validField,
    },
  });

  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />;
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
