import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useAuthForm<TSchema extends z.ZodType<any, any, any>>({
  schema,
  defaultValues,
}: {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
}) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });
}
