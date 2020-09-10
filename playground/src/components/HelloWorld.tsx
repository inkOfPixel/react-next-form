import * as React from "react";
import { useForm } from "react-next-form";

export default function HelloWorld() {
  const form = useForm({
    initialValues: {
      name: "",
    },
    onSubmit: async () => {
      alert("submitted!");
    },
  });
  return (
    <div className="App">
      <h1>Hello {form.values.name.length > 0 ? form.values.name : "buddy"}!</h1>
      <div className="input">
        <label htmlFor="foo">Your name:</label>
        <input
          id="foo"
          placeholder="type your name"
          type="text"
          {...form.fieldProps("name")}
        />
      </div>
    </div>
  );
}
