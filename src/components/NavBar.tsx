import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';

import { useAuth } from 'hooks/auth';

const NavBar = () => {
  const { logout } = useAuth();

  return (
    <Box bg={useColorModeValue('purple.500', 'purple.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Heading color="white">Controle de pessoas</Heading>
        </Box>
        <Button colorScheme="red" onClick={() => logout()}>
          Sair
        </Button>
      </Flex>
    </Box>
  );
};

export default NavBar;
