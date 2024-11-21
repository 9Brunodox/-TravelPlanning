import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Trip {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirmed: boolean
}

interface DestinationHeaderProps {
    onTripLoad: (trip: Trip | undefined) => void;
}

export function DestinationHeader({ onTripLoad }: DestinationHeaderProps) {
    const { tripId } = useParams();
    const [trip, setTrip] = useState<Trip | undefined>();

    useEffect(() => {
        api.get(`/trips/${tripId}`).then(response => {
            setTrip(response.data.trip);
            onTripLoad(response.data.trip); // Passa a trip carregada para o componente pai
        });
    }, [tripId, onTripLoad]);

    const displayedDate = trip
        ? format(trip.starts_at, "d 'de' LLL", { locale: ptBR }).concat(' até ').concat(
            format(trip.ends_at, "d 'de' LLL", { locale: ptBR })
        )
        : null;

    return (
        <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MapPin className="size-y text-zinc-400" />
                <span className="text-lg text-zinc-100">{trip?.destination}</span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <Calendar className="size-y text-zinc-400" />
                    <span className="text-zinc-100">{displayedDate}</span>
                </div>

                <div className="w-px h-6 bg-zinc-800" />

                <Button variant="grayButton">
                    Alterar local/data
                    <Settings2 className="size-5" />
                </Button>
            </div>
        </div>
    );
}
