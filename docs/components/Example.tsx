import * as React from "react";
import { useForm, useFormContext, FormProvider } from "../../.";
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
  SwitchProps,
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
  const [initialValues, setInitialValues] = React.useState<ExampleValues>({
    email: "",
    name: "",
  });
  const form = useForm<ExampleValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      email: yup.string().required("email is required"),
      name: yup.string(),
    }),
    onSubmit: async (values, context) => {
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
              <Stack wrap="nowrap" direction="row">
                <Button
                  colorScheme="gray"
                  onClick={() => {
                    form.reset(initialValues, {
                      keepTouchedStatus: form.values.meta?.keepTouched,
                      keepDirtyFields: form.values.meta?.keepDirty,
                    });
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
              <Stack spacing="tight">
                <FormControl as={Flex} alignItems="center">
                  <FormLabel htmlFor="touched" color="white">
                    Keep touched status
                  </FormLabel>
                  <CustomSwitch
                    id="touched"
                    mt="-5px"
                    name="meta.keepTouched"
                  />
                </FormControl>
                <FormControl as={Flex} alignItems="center">
                  <FormLabel htmlFor="dirty" color="white">
                    Keep changes
                  </FormLabel>
                  <CustomSwitch id="dirty" mt="-5px" name="meta.keepDirty" />
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
                  form.dirtyFields
                </Text>
                <ReactJson
                  name="dirtyFields"
                  src={form.dirtyFields}
                  collapsed
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

function CustomSwitch(props: SwitchProps) {
  const form = useFormContext<ExampleValues>();
  const fieldProps = form.fieldProps({
    name: props.name,
    type: "checkbox",
  });
  return <Switch {...props} {...fieldProps} isChecked={fieldProps.checked} />;
}