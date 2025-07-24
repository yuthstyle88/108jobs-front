import { z } from "zod";
import { EditForm } from "@/components/EditForm";
import { HttpService } from "@/services/HttpService";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export default function Page() {
  return (
    <EditForm
      schema={schema}
      defaultValues={{ name: "", email: "" }}
      onSubmit={async (data) => {
        await HttpService.client.saveData(data); // real backend call
      }}
    />
  );
}