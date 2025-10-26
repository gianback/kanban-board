interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

export function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className="bg-[#1C5A7C] px-4 py-2 text-white cursor-pointer rounded-md"
    >
      {children}
    </button>
  );
}
