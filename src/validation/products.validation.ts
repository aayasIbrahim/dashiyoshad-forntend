import z from "zod";

const productFields = {
	name: z
		.string({ error: "Enter a product name." })
		.trim()
		.min(1, "Enter a product name.")
		.max(160, "Product name cannot exceed 160 characters."),
	description: z
		.string({ error: "Description must be text." })
		.trim()
		.max(5000, "Description cannot exceed 5000 characters.")
		.nullable(),
	price: z
		.coerce.number({ error: "Enter a valid price." })
		.finite({ error: "Enter a valid price." })
		.min(0, "Price cannot be negative."),
	sku: z
		.string({ error: "Enter a product SKU." })
		.trim()
		.min(1, "Enter a product SKU.")
		.max(80, "SKU cannot exceed 80 characters.")
		.transform((sku) => sku.toUpperCase()),
	stock: z
		.coerce.number({ error: "Enter a valid stock quantity." })
		.int("Stock must be a whole number.")
		.min(0, "Stock cannot be negative."),
	weight: z
		.string({ error: "Weight must be text." })
		.trim()
		.max(100, "Weight cannot exceed 100 characters.")
		.nullable(),
	categoryId: z.uuid({ error: "Select a valid category." }),
};

const CreateProductZodSchema = z.object({
	name: productFields.name,
	description: productFields.description.optional(),
	price: productFields.price,
	sku: productFields.sku,
	stock: productFields.stock.optional(),
	weight: productFields.weight.optional(),
	categoryId: productFields.categoryId,
});

const UpdateProductZodSchema = z.object({
	name: productFields.name.optional(),
	description: productFields.description.optional(),
	price: productFields.price.optional(),
	sku: productFields.sku.optional(),
	stock: productFields.stock.optional(),
	weight: productFields.weight.optional(),
	categoryId: productFields.categoryId.optional(),
});

const ProductFormZodSchema = z.object({
	name: productFields.name,
	description: z
		.string({ error: "Description must be text." })
		.trim()
		.max(5000, "Description cannot exceed 5000 characters."),
	price: z
		.number({ error: "Enter a valid price." })
		.finite({ error: "Enter a valid price." })
		.min(0, { error: "Price cannot be negative." }),
	sku: productFields.sku,
	stock: z
		.number({ error: "Enter a valid stock quantity." })
		.int({ error: "Stock must be a whole number." })
		.min(0, { error: "Stock cannot be negative." }),
	weight: z
		.string({ error: "Weight must be text." })
		.trim()
		.max(100, "Weight cannot exceed 100 characters."),
	categoryId: z.uuid({ error: "Select a valid category." }),
});

const ProductIdZodSchema = z.object({
	id: z.uuid({ error: "The selected product is invalid." }),
});

const ListProductsQueryZodSchema = z
	.object({
		search: z
			.string({ error: "Search text must be text." })
			.trim()
			.min(1, "Enter at least one search character.")
			.max(100, "Search cannot exceed 100 characters.")
			.optional(),
		categoryId: z.uuid({ error: "Select a valid category." }).optional(),
		minPrice: z
			.coerce.number({ error: "Enter a valid minimum price." })
			.finite("Enter a valid minimum price.")
			.min(0, "Minimum price cannot be negative.")
			.optional(),
		maxPrice: z
			.coerce.number({ error: "Enter a valid maximum price." })
			.finite("Enter a valid maximum price.")
			.min(0, "Maximum price cannot be negative.")
			.optional(),
		inStock: z
			.enum(["true", "false"], { error: "Choose a valid stock filter." })
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
		sortBy: z
			.enum(["name", "price", "stock", "createdAt", "updatedAt"])
			.default("createdAt"),
		sortOrder: z
			.enum(["asc", "desc"], { error: "Choose a valid sort order." })
			.default("desc"),
	})
	.refine(
		({ minPrice, maxPrice }) =>
			minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
		{
			message: "Minimum price cannot be greater than maximum price.",
			path: ["minPrice"],
		},
	);

export const ProductValidation = {
	CreateProductZodSchema,
	UpdateProductZodSchema,
	ProductFormZodSchema,
	ProductIdZodSchema,
	ListProductsQueryZodSchema,
};
