import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QueryResponse } from "@/types/queryResponse";

type QueryBarProps = {
  namespace: string;
  setTimestamps: (timestamps: number[]) => void;
  changeTrigger: () => void;
};

const querySchema = z.object({
  query: z.string().min(1, {
    message: "Query cannot be empty.",
  }),
});

export default function QueryBar({
  namespace,
  setTimestamps,
  changeTrigger,
}: QueryBarProps) {
  const queryForm = useForm<z.infer<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof querySchema>) {
    const formData = new FormData();
    formData.append("query", values.query); // "video" is the key expected on the server side

    const response = await fetch(
      `http://localhost:8000/video/query?namespace=${encodeURIComponent(
        namespace
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result: QueryResponse = await response.json();
    console.log(result);
    setTimestamps(result.timestamps);
    changeTrigger();
  }

  return (
    <Form {...queryForm}>
      <form
        onSubmit={queryForm.handleSubmit(onSubmit)}
        className="space-y-8 w-1/2"
      >
        <FormField
          control={queryForm.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Search Your Video" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
