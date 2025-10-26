import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Modal } from "@/components/shared/modal";
import debounce from "just-debounce-it";
import { exportBacklog } from "@/services/export-backlog";
import { getCards } from "@/services/get-cards";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useSocket } from "@/hooks/use-socket";
import { Status, type Card as ICard } from "@/interfaces/card";
import { PRIORITY_COLOR, PRIORITY_COLOR_TEXT } from "@/utils/colors";
import Card from "@/components/shared/card";

export default function Home() {
  const [openModalCreateCard, setOpenModalCreateCard] = useState(false);
  const [openModalExportBacklog, setOpenModalExportBacklog] = useState(false);
  const [sendingCsv, setSendingCsv] = useState(false);

  const {
    connectToServer,
    emitCreatedCard,
    emitUpdatedCard,
    onCreatedCard,
    onUpdatedCard,
  } = useSocket();

  const [refBacklog, backlogCardsValues, setBacklogCards] = useDragAndDrop<
    HTMLUListElement,
    ICard
  >([], {
    group: "todoList",
    sortable: false,

    onTransfer: async (data) => {
      if (data.targetParent.el === refBacklog.current) {
        const card = {
          ...(data.draggedNodes[0]?.data?.value as ICard),
          status: Status.PENDING,
        };

        emitUpdatedCard(card);

        toast.success("Tarea actualizada con éxito");
      }
    },
  });
  const [refInProgress, inProgressCardsValues, setInProgressCards] =
    useDragAndDrop<HTMLUListElement, ICard>([], {
      group: "todoList",
      sortable: false,
      onTransfer: async (data) => {
        if (data.targetParent.el === refInProgress.current) {
          debounce(() => {
            const card = {
              ...(data.draggedNodes[0]?.data?.value as ICard),
              status: Status.IN_PROGRESS,
            };

            emitUpdatedCard(card);
            toast.success("Tarea actualizada con éxito");
          }, 2000)();
        }
      },
    });

  const [refDone, doneCardsValues, setDoneCards] = useDragAndDrop<
    HTMLUListElement,
    ICard
  >([], {
    group: "todoList",
    sortable: false,

    onTransfer: async (data) => {
      if (data.targetParent.el === refDone.current) {
        debounce(() => {
          const card = {
            ...(data.draggedNodes[0]?.data?.value as ICard),
            status: Status.COMPLETED,
          };

          emitUpdatedCard(card);
          toast.success("Tarea actualizada con éxito");
        }, 500)();
      }
    },
  });

  function handleCloseModalCreateCard() {
    setOpenModalCreateCard(false);
  }

  function handleModalCreateCard() {
    setOpenModalCreateCard(true);
  }

  function handleCloseModalExportBacklog() {
    setOpenModalExportBacklog(false);
  }

  function handleModalExportBacklog() {
    setOpenModalExportBacklog(true);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
    }).format(new Date(date));
  }

  async function getData() {
    const cards = await getCards();

    const cardsByStatus = cards.reduce(
      (
        acc: {
          pending: any[];
          inProgress: any[];
          done: any[];
        },
        card: any
      ) => {
        if (card.status === "PENDING") {
          acc.pending.push(card);
        } else if (card.status === "IN_PROGRESS") {
          acc.inProgress.push(card);
        } else if (card.status === "COMPLETED") {
          acc.done.push(card);
        }
        return acc;
      },
      {
        pending: [],
        inProgress: [],
        done: [],
      }
    );

    setBacklogCards(cardsByStatus.pending);
    setInProgressCards(cardsByStatus.inProgress);
    setDoneCards(cardsByStatus.done);
  }

  async function handleSubmitFormCard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = `${formData.get("title")}`;
    const description = `${formData.get("description")}` || "";
    const priority = `${formData.get("priority")}`;

    const autor = sessionStorage.getItem("name") || "";

    const payload = {
      autor,
      title,
      description,
      priority,
    };

    emitCreatedCard(payload);

    toast.success("Tarea creada con éxito");

    setOpenModalCreateCard(false);

    e.currentTarget.reset();
  }

  async function handleSubmitExportBacklog(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      setSendingCsv(true);

      const isOk = await exportBacklog(email);

      if (!isOk) {
        toast.error("Hubo un error al enviar el backlog");
        return;
      }

      toast.success("Backlog enviado con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Hubo un error al enviar el backlog");
    } finally {
      setSendingCsv(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    connectToServer();
  }, []);

  function saveUpdatedCard(card: ICard) {
    const allSetters = [
      { status: Status.PENDING, setter: setBacklogCards },
      { status: Status.IN_PROGRESS, setter: setInProgressCards },
      { status: Status.COMPLETED, setter: setDoneCards },
    ];

    allSetters.forEach(({ status, setter }) => {
      setter((prev) =>
        status === card.status
          ? [...prev, card]
          : prev.filter((c) => c.id !== card.id)
      );
    });
  }

  useEffect(() => {
    onCreatedCard((card) => setBacklogCards((prev) => [...prev, card]));
  }, []);

  useEffect(() => {
    onUpdatedCard((card) => saveUpdatedCard(card));
  }, []);

  return (
    <>
      <main>
        <div className="container px-4 mx-auto py-20">
          <h1 className="text-4xl text-center font-bold mb-2">
            Tablero Kanban
          </h1>

          <div className="flex justify-end gap-8 items-center">
            <Button onClick={handleModalCreateCard}>Crear Tarea +</Button>
            <Button onClick={handleModalExportBacklog}>Exportar Backlog</Button>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-12">
            <p className="text-center text-base font-medium py-2 text-white bg-[#1C5A7C]">
              Tareas Pendientes
            </p>
            <p className="text-center text-base font-medium py-2 text-white bg-[#1C5A7C]">
              Tareas en progreso
            </p>
            <p className="text-center text-base font-medium py-2 text-white bg-[#1C5A7C]">
              Tareas Terminadas
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8  kanban-board min-h-screen">
            <ul ref={refBacklog} className="space-y-4">
              {backlogCardsValues.map((card) => (
                <li className="kanban-item" key={card.id}>
                  <Card className={`${PRIORITY_COLOR[card.priority]} p-4`}>
                    <Card.Header>
                      <p
                        className={`${
                          PRIORITY_COLOR_TEXT[card.priority]
                        } w-fit rounded-md px-4 py-2 text-white font-bold text-sm`}
                      >
                        {card.priority}
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <div className="flex justify-between gap-4 items-center">
                        <h2 className="text-base text-left max-w-[35ch] font-medium">
                          {card.title}
                        </h2>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-base shrink-0 font-normal text-[#2B3744]">
                          {formatDate(card.created_at)}
                        </p>
                        <p className="text-sm font-bold text-black mt-12 text-end">
                          {card.autor}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </li>
              ))}
            </ul>

            <ul ref={refInProgress} className="space-y-4">
              {inProgressCardsValues.map((card) => (
                <li className={`kanban-item`} key={card.id}>
                  <Card className={`${PRIORITY_COLOR[card.priority]} p-4`}>
                    <Card.Header>
                      <p
                        className={`${
                          PRIORITY_COLOR_TEXT[card.priority]
                        } w-fit rounded-md px-4 py-2 text-white font-bold text-sm`}
                      >
                        {card.priority}
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <div className="flex justify-between gap-4 items-center">
                        <h2 className="text-base text-left max-w-[35ch] font-medium">
                          {card.title}
                        </h2>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-base shrink-0 font-normal text-[#2B3744]">
                          {formatDate(card.created_at)}
                        </p>
                        <p className="text-sm font-bold text-black mt-12 text-end">
                          {card.autor}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </li>
              ))}
            </ul>

            <ul ref={refDone} className="space-y-4">
              {doneCardsValues.map((card) => (
                <li className="kanban-item" key={card.id}>
                  <Card className={`${PRIORITY_COLOR[card.priority]} p-4`}>
                    <Card.Header>
                      <p
                        className={`${
                          PRIORITY_COLOR_TEXT[card.priority]
                        } w-fit rounded-md px-4 py-2 text-white font-bold text-sm`}
                      >
                        {card.priority}
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <div className="flex justify-between gap-4 items-center">
                        <h2 className="text-base text-left max-w-[35ch] font-medium">
                          {card.title}
                        </h2>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-base shrink-0 font-normal text-[#2B3744]">
                          {formatDate(card.created_at)}
                        </p>
                        <p className="text-sm font-bold text-black mt-12 text-end">
                          {card.autor}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Modal
        open={openModalExportBacklog}
        handleClose={handleCloseModalExportBacklog}
      >
        <form
          onSubmit={handleSubmitExportBacklog}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2 flex-col">
            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" disabled={sendingCsv}>
            {sendingCsv ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </Modal>
      <Modal
        open={openModalCreateCard}
        handleClose={handleCloseModalCreateCard}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmitFormCard}>
          <div className="flex gap-2 flex-col">
            <label htmlFor="title">Título</label>
            <Input id="title" name="title" required />
          </div>
          <div className="flex gap-2 flex-col">
            <label htmlFor="description">Descripción</label>
            <Input id="description" name="description" />
          </div>
          <div className="flex gap-2 flex-col">
            <label htmlFor="priority">Prioridad</label>
            <select
              name="priority"
              id="priority"
              className="w-full block py-2 px-3 rounded-md border border-gray-300"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <Button type="submit">Enviar</Button>
        </form>
      </Modal>
    </>
  );
}
