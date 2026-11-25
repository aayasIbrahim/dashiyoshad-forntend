"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  productQueryKey,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/product.hook";
import type { Category, IProduct } from "@/types";
import { getUserFriendlyErrorMessage } from "@/lib/user-error";
import { ProductValidation } from "@/validation";

interface ProductFormProps {
  product?: IProduct;
  categories: Category[];
  onCancel: () => void;
  onSaved: () => void;
}

export function ProductForm({
  product,
  categories,
  onCancel,
  onSaved,
}: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const queryClient = useQueryClient();
  const [productImages, setProductImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<
    { file: File; url: string }[]
  >([]);
  const isPending = createProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    const nextPreviews = productImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [productImages]);

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: Number(product?.price ?? 0),
      sku: product?.sku ?? "",
      stock: product?.stock ?? 0,
      weight: product?.weight ?? "",
      categoryId: product?.categoryId ?? "",
    },
    validators: {
      onSubmit: ProductValidation.ProductFormZodSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        description: value.description.trim() || null,
        sku: value.sku.trim().toUpperCase(),
        weight: value.weight.trim() || null,
        productImages,
      };
      const callbacks = {
        onSuccess: async (response: {
          success: boolean;
          message: string;
        }) => {
          if (!response.success) {
            toast.add({
              title: getUserFriendlyErrorMessage(
                response.message,
                "Unable to save product.",
              ),
              type: "error",
            });
            return;
          }

          await queryClient.invalidateQueries({ queryKey: productQueryKey });
          toast.add({
            title: product ? "Product updated" : "Product created",
            type: "success",
          });
          onSaved();
        },
        onError: (error: Error) => {
          toast.add({
            title: "Unable to save product",
            description: getUserFriendlyErrorMessage(error.message),
            type: "error",
          });
        },
      };

      if (product) {
        updateProduct.mutate(
          {
            id: product.id,
            payload: {
              name: payload.name,
              description: payload.description,
              price: payload.price,
              sku: payload.sku,
              stock: payload.stock,
              weight: payload.weight,
              categoryId: payload.categoryId,
            },
          },
          callbacks,
        );
        return;
      }

      createProduct.mutate(payload, callbacks);
    },
  });

  return (
    <form
      className="flex flex-1 flex-col overflow-y-auto"
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
                <FieldLabel htmlFor={field.name}>Product name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. Cotton panjabi"
                  maxLength={160}
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

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  maxLength={5000}
                  aria-invalid={isInvalid}
                  className="w-full rounded-xl border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="price">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Price (BDT)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    aria-invalid={isInvalid}
                    className="h-10 rounded-xl px-3"
                    value={Number.isNaN(field.state.value) ? "" : field.state.value}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value === ""
                          ? Number.NaN
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="stock">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    step="1"
                    required
                    aria-invalid={isInvalid}
                    className="h-10 rounded-xl px-3"
                    value={Number.isNaN(field.state.value) ? "" : field.state.value}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value === ""
                          ? Number.NaN
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="sku">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>SKU</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. PAN-001"
                  maxLength={80}
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

        <form.Field name="weight">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Weight</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. 250g"
                  maxLength={100}
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

        <form.Field name="categoryId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <select
                  id={field.name}
                  name={field.name}
                  required
                  aria-invalid={isInvalid}
                  className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {!product && (
          <Field>
            <FieldLabel htmlFor="productImages">Product images</FieldLabel>
            <label
              htmlFor="productImages"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground hover:bg-muted/30"
            >
              <ImagePlus aria-hidden="true" className="size-5" />
              <span>Select one or more images</span>
            </label>
            <input
              id="productImages"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) =>
                setProductImages((current) => [
                  ...current,
                  ...Array.from(event.target.files ?? []),
                ])
              }
            />
            {previews.length > 0 && (
              <ul className="grid grid-cols-3 gap-3">
                {previews.map(({ file, url }, index) => (
                  <li
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="relative overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={url}
                      alt={file.name}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground"
                      onClick={() =>
                        setProductImages((current) =>
                          current.filter((_, fileIndex) => fileIndex !== index),
                        )
                      }
                    >
                      <X aria-hidden="true" className="size-3" />
                    </button>
                    <span className="block truncate px-2 py-1 text-xs">
                      {file.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Field>
        )}
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
          disabled={isPending || categories.length === 0}
        >
          {isPending ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
