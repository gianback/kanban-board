interface Props {
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
}

export function Modal({ children, handleClose, open }: Props) {
  return (
    <dialog
      open={open}
      onClose={handleClose}
      className="fixed bg-black/50 w-full  items-center justify-center h-full inset-0 z-[100]"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative bg-white p-8 rounded-md min-w-[500px]">
          {children}

          <button
            onClick={handleClose}
            className="absolute z-[2] top-2 right-4 cursor-pointer"
          >
            x
          </button>
        </div>
      </div>
    </dialog>
  );
}
