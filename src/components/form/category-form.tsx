"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  categoryQueryKey,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/category.hook";
import type { Category } from "@/types";
import { getUserFriendlyErrorMessage } from "@/lib/user-error";
import { CategoryValidation } from "@/validation";
import { toast } from "@/components/ui/toast";

interface CategoryFormProps {
  category?: Category;
  onCancel: () => void;
  onSaved: () => void;
}

export function CategoryForm({
  category,
  onCancel,
  onSaved,
}: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const queryClient = useQueryClient();
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
    },
    validators: {
      onSubmit: CategoryValidation.CreateCategoryZodSchema,
    },
    onSubmit: ({ value }) => {
      const callbacks = {
        onSuccess: async (response: { success: boolean; message: string }) => {
          if (!response.success) {
            toast.add({
              title: getUserFriendlyErrorMessage(
                response.message,
                "Unable to save category.",
              ),
              type: "error",
            });
            return;
          }

          await queryClient.invalidateQueries({ queryKey: categoryQueryKey });
          toast.add({
            title: category ? "Category updated" : "Category created",
            type: "success",
          });
          onSaved();
        },
        onError: (error: Error) => {
          toast.add({
            title: "Unable to save category",
            description: getUserFriendlyErrorMessage(error.message),
            type: "error",
          });
        },
      };

      if (category) {
        updateCategory.mutate({ id: category.id, payload: value }, callbacks);
        return;
      }

      createCategory.mutate(value, callbacks);
    },
  });

  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-5 p-6">
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="e.g. Accessories"
                  maxLength={100}
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  className="h-10 rounded-xl px-3"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="mt-auto flex justify-end gap-2 border-t p-6">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-xl px-4"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-9 rounded-xl px-4"
          disabled={isPending}
        >
          {isPending
            ? "Saving…"
            : category
              ? "Save changes"
              : "Create category"}
        </Button>
      </div>
    </form>
  );
}
