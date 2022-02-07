import { useCallback } from 'react';
import { Form } from '@unform/web';
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';

import { useAuth } from 'hooks/auth';

import Input from 'components/Inputs/Default';

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = useCallback(
    async data => {
      await login(data);
    },
    [login],
  );

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            Seja bem vindo! Faça seu login
          </Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <Form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                name="username"
                label="Nome de usário"
                autoComplete="off"
                autoCorrect="off"
              />
              <Input
                name="password"
                label="Senha"
                type="password"
                autoComplete="off"
                autoCorrect="off"
              />
              <Stack spacing={10}>
                <Button
                  bg="blue.400"
                  color="white"
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                >
                  Entrar
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
