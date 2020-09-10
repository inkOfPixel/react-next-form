import * as React from "react";
import { useForm } from "react-next-form";
import * as yup from "yup";

interface HelloWorldValues {
  name: string;
}

const validationSchema: yup.ObjectSchema<HelloWorldValues> = yup
  .object({
    name: yup.string().required("è richiesto un nome"),
  })
  .defined();

export default function HelloWorld() {
  const form = useForm<HelloWorldValues>({
    initialValues: {
      name: "",
    },
    onSubmit: async () => {
      alert("submitted!");
    },
    validationSchema,
  });
  return (
    <div className="App">
      <h1>Hello {form.values.name.length > 0 ? form.values.name : "buddy"}!</h1>
      <p>State: {form.status}</p>
      <div className="input">
        <label htmlFor="foo">Your name:</label>
        <input
          id="foo"
          placeholder="type your name"
          type="text"
          {...form.fieldProps("name")}
        />
        <p>{form.validationErrors["name"]}</p>
      </div>
    </div>
  );
}
