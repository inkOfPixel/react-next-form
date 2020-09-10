import { ChakraProvider } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import * as React from "react";
import Example from "./components/Example";

export const App = () => (
  <ChakraProvider theme={theme} resetCSS>
    <Example />
  </ChakraProvider>
);
