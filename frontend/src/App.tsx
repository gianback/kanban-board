import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./components/shared/modal";
import { Input } from "./components/shared/input";
import { Button } from "./components/shared/button";
import { Spinner } from "./components/shared/spinner";
import Home from "./pages/home";

export default function App() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    sessionStorage.setItem("name", name);
    setOpen(false);
    setLoading(false);
  }

  useEffect(() => {
    const name = sessionStorage.getItem("name");

    if (name) {
      setOpen(false);
    }

    setLoading(false);
  }, []);

  return (
    <>
      {!loading && !open && <Home />}
      {!loading && open && (
        <Modal open={open} handleClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2 flex-col">
              <label htmlFor="name">Nombre</label>
              <Input id="name" name="name" type="name" required />
            </div>
            <Button type="submit">Enviar</Button>
          </form>
        </Modal>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      )}
    </>
  );
}
