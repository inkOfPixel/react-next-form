import { Button, Flex, Input, Stack } from "@chakra-ui/core";
import * as React from "react";
import { useForm } from "react-next-form";

export default function BasicForm() {
  const form = useForm({
    initialValues: { name: "" },
    onSubmit: (values: any) => alert(values.name),
  });
  return (
    <Flex bg="gray.900" justify="center" align="center" py="8" h="100vh">
      <Stack direction="column">
        <Input placeholder="type your name" {...form.fieldProps("name")} />
        <Button colorScheme="blue" onClick={form.submit}>
          Submit
        </Button>
      </Stack>
    </Flex>
  );
}
