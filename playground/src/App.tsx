import {
  ChakraProvider,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  Flex,
  extendTheme,
  MenuProps,
  Box,
} from "@chakra-ui/core";
import * as React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Example from "./components/Example";
import BasicForm from "./components/BasicForm";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        h: "100%",
      },
      body: {
        bg: "gray.900",
      },
      "#root": {
        h: "100%",
      },
    },
  },
});

export const App = () => (
  <ChakraProvider theme={theme} resetCSS>
    <Router>
      <Flex bg="gray.900" direction="column" h="full">
        <Flex px="2" py="2">
          <PlaygroundMenu />
        </Flex>
        <Box bg="gray.700" h="full">
          <Switch>
            <Route path="/kitchen-sink">
              <Example />
            </Route>
            <Route path="/">
              <BasicForm />
            </Route>
          </Switch>
        </Box>
      </Flex>
    </Router>
  </ChakraProvider>
);

function PlaygroundMenu(props: Partial<MenuProps>) {
  return (
    <Menu {...props}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Examples
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to="/">
          Basic
        </MenuItem>
        <MenuItem as={Link} to="/kitchen-sink">
          Kitchen sink
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
