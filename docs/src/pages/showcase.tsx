import { ChakraProvider } from "@chakra-ui/core";
import Layout from "@theme/Layout";
import React from "react";
import { useForm } from "../../../";
import Example from "../../components/Example";

interface ExampleValues {
  email: string;
  name: string;
  addresses?: Array<{ id: string; street: string }>;
  meta?: {
    keepTouched?: boolean;
    keepDirty?: boolean;
  };
}

function Showcase() {
  const form = useForm<ExampleValues>({
    initialValues: {
      email: "",
      name: "",
    },
  });
  React.useEffect(() => {
    console.log({ form });
  }, [form]);
  return (
    <Layout title="Showcase">
      <ChakraProvider resetCSS>
        <Example />
      </ChakraProvider>
    </Layout>
  );
}

export default Showcase;
