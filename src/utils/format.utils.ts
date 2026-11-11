const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
});

function parseDate(value: string | Date) {
  if (value instanceof Date) {
    return value;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
}

export function formatDate(value: string | Date) {
  return dateFormatter.format(parseDate(value));
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(parseDate(value));
}

export function formatCurrency(value: string | number) {
  return currencyFormatter.format(Number(value));
}
export function formatPaymentMethod(method: string) {
  return method
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
