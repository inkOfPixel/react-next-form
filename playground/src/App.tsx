import { ChakraProvider } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import * as React from "react";
// import Example from "./components/Example";
import HelloWorld from "./components/HelloWorld";

export const App = () => (
  <ChakraProvider theme={theme} resetCSS>
    {/* <Example /> */}
    <HelloWorld />
  </ChakraProvider>
);
