import { Mail, User, X } from "lucide-react";
import { Button } from "../../components/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Trip {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirmed: boolean
}

interface ConfirmTripModalProps {
    closeConfirmTripModal: () => void;
    setOwnerName: (name: string) => void;
    setOwnerEmail: (email: string) => void;
    createTrip: (event: React.FormEvent<HTMLFormElement>) => void;
    trip: Trip | undefined;
}

export function ConfirmTripModal(props: ConfirmTripModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-zinc-900 w-[640px] rounded-xl py-5 px-6 shadow-shape space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Confirmar criação de viagem</h2>
                        <button type="button" onClick={props.closeConfirmTripModal}>
                            <X className="size-5 text-zinc-400" />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-400">
                        Para concluir a criação da viagem para{" "}
                        <span className="text-zinc-100 font-semibold">{props.trip?.destination}</span>{" "}
                        nas datas de{" "}
                        <span className="text-zinc-100 font-semibold">
                            {props.trip
                                ? `${format(props.trip.starts_at, "d 'de' LLL", { locale: ptBR })} até ${format(
                                      props.trip.ends_at,
                                      "d 'de' LLL",
                                      { locale: ptBR }
                                  )}`
                                : "datas indisponíveis"}
                        </span>{" "}
                        preencha seus dados abaixo:
                    </p>
                </div>
                <form onSubmit={props.createTrip} className="space-y-3">
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <User className="size-5 text-zinc-400" />
                        <input
                            name="name"
                            placeholder="Seu nome completo"
                            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                            onChange={(event) => props.setOwnerName(event.target.value)}
                        />
                    </div>
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <Mail className="size-5 text-zinc-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Seu e-mail pessoal"
                            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                            onChange={(event) => props.setOwnerEmail(event.target.value)}
                        />
                    </div>

                    <Button variant="greenButton" size="full">
                        Confirmar criação de viagem
                    </Button>
                </form>
            </div>
        </div>
    );
}
