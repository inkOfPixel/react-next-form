import * as React from "react";
import { useForm } from "../../.";
import {
  Box,
  Text,
  Stack,
  Heading,
  SimpleGrid,
  Button,
  FormControl,
  Flex,
  FormLabel,
  Switch,
  Input,
  Spinner,
} from "@chakra-ui/core";
import ReactJson from "react-json-view";
import { uniqueId } from "lodash";
import { enablePatches } from "immer";
import * as yup from "yup";

enablePatches();

interface ExampleValues {
  email: string;
  name: string;
  addresses?: Array<{ id: string; street: string }>;
  meta?: {
    keepTouched?: boolean;
    keepDirty?: boolean;
  };
}

export default function Example() {
  const form = useForm<ExampleValues>({
    initialValues: {
      email: "",
      name: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("email is required"),
      name: yup.string(),
    }),
  });

  return (
    <Box bg="gray.800" p="12">
      <Stack w="full">
        <Heading color="white">useForm</Heading>
        <SimpleGrid columns={2} spacing="4">
          <Stack direction="column" bg="gray.700" p="6" borderRadius="12px">
            <Stack wrap="nowrap" direction="row">
              <Button
                colorScheme="gray"
                onClick={() => {
                  form.reset({
                    keepTouchedStatus: form.values.meta?.keepTouched,
                    keepDirtyFields: form.values.meta?.keepDirty,
                    initialValues: {
                      name: "Macs",
                      email: "pippo@hey.com",
                    },
                  });
                }}
              >
                Reset
              </Button>
              <Button
                colorScheme="gray"
                onClick={() => {
                  console.log("undo");
                }}
              >
                undo
              </Button>
            </Stack>
            <Stack spacing="tight">
              <FormControl as={Flex} alignItems="center">
                <FormLabel htmlFor="touched" color="white">
                  Keep touched status
                </FormLabel>
                <Switch
                  id="touched"
                  mt="-5px"
                  {...form.fieldProps({
                    name: "meta.keepTouched",
                  })}
                />
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel htmlFor="dirty" color="white">
                  Keep changes
                </FormLabel>
                <Switch
                  id="dirty"
                  mt="-5px"
                  {...form.fieldProps({
                    name: "meta.keepDirty",
                  })}
                />
              </FormControl>
            </Stack>
            <FormControl id="email">
              <FormLabel color="white">Email address</FormLabel>
              <Input
                type="email"
                placeholder="email"
                {...form.fieldProps("email")}
              />
            </FormControl>
            <FormControl id="name">
              <FormLabel color="white">First name</FormLabel>
              <Input placeholder="name" {...form.fieldProps("name")} />
            </FormControl>
            <Text fontSize="xl" fontWeight="medium" color="white" pt="4">
              Addresses
            </Text>
            <Stack>
              <Button
                colorScheme="blue"
                onClick={() => {
                  const id = uniqueId("#");
                  form.list("addresses").append({ id, street: "" });
                }}
              >
                Add
              </Button>
            </Stack>
            <Stack direction="column">
              {form.values.addresses?.map((address, index) => {
                return (
                  <Flex align="flex-end" key={address.id}>
                    <FormControl>
                      <FormLabel color="white">Street</FormLabel>
                      <Input
                        placeholder="name"
                        {...form.fieldProps(`addresses[${index}].street`)}
                      />
                    </FormControl>
                    <Button
                      ml="2"
                      colorScheme="red"
                      onClick={() => {
                        form.list("addresses").remove(index);
                      }}
                    >
                      Remove
                    </Button>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>
          <Box p="6" borderRadius="12px" bg="gray.100">
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
              <ReactJson name="errors" src={form.errors} />
            </Stack>
            <Stack direction="column">
              <Text fontSize="xl" fontWeight="medium">
                form.dirtyFields
              </Text>
              <ReactJson name="dirtyFields" src={form.dirtyFields} collapsed />
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
  );
}
