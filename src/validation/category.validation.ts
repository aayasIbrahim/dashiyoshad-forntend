import z from "zod";

const CreateCategoryZodSchema = z.object({
	name: z
		.string({ error: "Enter a category name." })
		.trim()
		.min(1, "Enter a category name.")
		.max(100, "Category name cannot exceed 100 characters."),
});

const UpdateCategoryZodSchema = z
	.object({
		name: z
			.string({ error: "Enter a category name." })
			.trim()
			.min(1, "Enter a category name.")
			.max(100, "Category name cannot exceed 100 characters."),
	})
	.partial()
	.refine((payload) => Object.keys(payload).length > 0, {
		message: "At least one field must be provided",
	});

const CategoryIdZodSchema = z.object({
	id: z.uuid({ error: "The selected category is invalid." }),
});

const ListCategoriesQueryZodSchema = z.object({
	search: z
		.string({ error: "Search text must be text." })
		.trim()
		.min(1, "Enter at least one search character.")
		.max(100, "Search cannot exceed 100 characters.")
		.optional(),
	page: z
		.coerce.number({ error: "Enter a valid page number." })
		.int()
		.min(1, "Page number must be at least 1.")
		.default(1),
	limit: z
		.coerce.number({ error: "Enter a valid page size." })
		.int()
		.min(1, "Page size must be at least 1.")
		.max(100, "Page size cannot exceed 100.")
		.default(20),
	sortOrder: z
		.enum(["asc", "desc"], { error: "Choose a valid sort order." })
		.default("asc"),
});

export const CategoryValidation = {
	CreateCategoryZodSchema,
	UpdateCategoryZodSchema,
	CategoryIdZodSchema,
	ListCategoriesQueryZodSchema,
};
