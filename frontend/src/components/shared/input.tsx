interface Props {
  type?: string;
  name: string;
  id: string;
  required?: boolean;
}

export function Input({ type = "text", id, name, required = false }: Props) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      className="w-full block py-2 px-3 rounded-md border border-gray-300"
      required={required}
    />
  );
}
