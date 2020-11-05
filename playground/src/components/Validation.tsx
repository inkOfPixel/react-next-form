import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/core";
import * as React from "react";
import ReactJson from "react-json-view";
import { FormProvider, useForm } from "react-next-form";
import * as yup from "yup";

interface ExampleValues {
  name: string;
}

export default function Example() {
  const [initialValues] = React.useState<ExampleValues>({
    name: "",
  });
  console.log("validation");
  const form = useForm<ExampleValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: yup.object<ExampleValues>().shape<any>({
      name: yup.string().required(),
    }),
    onSubmit: (values, context) => {
      console.log("Submit!", { values, context });
      return undefined;
    },
  });

  return (
    <FormProvider form={form}>
      <Box bg="gray.800" p="12">
        <Stack w="full">
          <Heading color="white">useForm</Heading>
          <SimpleGrid columns={2} spacing="4">
            <Stack direction="column" bg="gray.700" p="6" borderRadius="12px">
              <Stack direction="row">
                <Button
                  colorScheme="gray"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Reset
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Submit
                </Button>
              </Stack>
              <FormControl id="name">
                <FormLabel color="white">First name</FormLabel>
                <Input placeholder="name" {...form.fieldProps("name")} />
              </FormControl>
            </Stack>
            <Box p="6" borderRadius="12px" bg="gray.100">
              <Stack direction="row">
                <Text fontSize="xl" fontWeight="medium">
                  form.status
                </Text>
                <Text fontSize="xl" fontWeight="medium">
                  {form.status}
                </Text>
              </Stack>
              <Stack direction="column">
                <Text fontSize="xl" fontWeight="medium">
                  form.values
                </Text>
                <ReactJson name="values" src={form.values} />
              </Stack>
              <Stack direction="column">
                <Stack direction="row" align="center">
                  <Text fontSize="xl" fontWeight="medium">
                    form.errors
                  </Text>
                  {form.isValidating && <Spinner size="sm" color="gray.500" />}
                </Stack>
                <ReactJson
                  name="validationErrors"
                  src={form.validationErrors}
                />
              </Stack>
              <Stack direction="column">
                <Text fontSize="xl" fontWeight="medium">
                  form.touchedFields
                </Text>
                <ReactJson
                  name="touchedFields"
                  src={form.touchedFields}
                  collapsed
                />
              </Stack>
              <Stack direction="column">
                <Text fontSize="xl" fontWeight="medium">
                  form.changes
                </Text>
                <ReactJson name="changes" src={form.changes} collapsed />
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Box>
    </FormProvider>
  );
}
