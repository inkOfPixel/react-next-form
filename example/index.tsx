import { ChakraProvider, theme } from "@chakra-ui/core";
import * as React from "react";
import "react-app-polyfill/ie11";
import * as ReactDOM from "react-dom";
import Example from "./Example";

const App = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Example />
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
