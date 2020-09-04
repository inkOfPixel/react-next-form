import { ChakraProvider } from "@chakra-ui/core";
import Layout from "@theme/Layout";
import React from "react";
import Example from "../../components/Example";

function Showcase() {
  return (
    <Layout title="Showcase">
      <ChakraProvider resetCSS>
        <Example />
      </ChakraProvider>
    </Layout>
  );
}

export default Showcase;
