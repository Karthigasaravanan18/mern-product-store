
import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  useColorMode
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.xl" px={4}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          as={RouterLink}
          to="/"
          fontSize="2xl"
          fontWeight="bold"
          color="blue.500"
        >
          Product Store 🛒
        </Text>

        <HStack spacing={2}>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="blue"
          >
            Add Product +
          </Button>

          <IconButton
            aria-label="Toggle color mode"
            icon={
              colorMode === "light"
                ? <MoonIcon />
                : <SunIcon />
            }
            onClick={toggleColorMode}
          />
        </HStack>
      </Flex>
    </Container>
  );
}

export default Navbar;
