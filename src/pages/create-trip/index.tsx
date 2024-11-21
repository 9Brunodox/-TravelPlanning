import { FormEvent, useState } from 'react';
import plannerImg from '../../../public/Logo.png';
import { useNavigate } from 'react-router-dom';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destination-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';

export function CreateTripPage() {
    const navigate = useNavigate();

    const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
    const [isGuestsModalOpen, setIsGuestsmodalOpen] = useState(false);
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

    const [destination, setDestination] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>();

    const [emailsToInvite, setEmailsToInvite] = useState(['bruno@gmail.com']);

    const trip = {
        id: '', // Pode ser deixado vazio
        destination: destination,
        starts_at: eventStartAndEndDates?.from?.toISOString() || '',
        ends_at: eventStartAndEndDates?.to?.toISOString() || '',
        is_confirmed: false
    };

    function openGuestsInput() {
        setIsGuestsInputOpen(true);
    }

    function closeGuestsInput() {
        setIsGuestsInputOpen(false);
    }

    function openGuestsModal() {
        setIsGuestsmodalOpen(true);
    }

    function closeGuestsModal() {
        setIsGuestsmodalOpen(false);
    }

    function openConfirmTripModal() {
        setIsConfirmTripModalOpen(true);
    }

    function closeConfirmTripModal() {
        setIsConfirmTripModalOpen(false);
    }

    async function createTrip(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(destination);
        console.log(eventStartAndEndDates);
        console.log(emailsToInvite);
        console.log(ownerName);
        console.log(ownerEmail);

        if (!destination) return;
        if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) return;
        if (emailsToInvite.length === 0) return;
        if (!ownerName || !ownerEmail) return;

        const response = await api.post('/trips', {
            destination,
            starts_at: eventStartAndEndDates.from,
            ends_at: eventStartAndEndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
        });

        const { tripId } = response.data;
        navigate(`/trips/${tripId}`);
    }

    function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString();
        if (!email) return;
        if (emailsToInvite.includes(email)) return;
        setEmailsToInvite([...emailsToInvite, email]);
        event.currentTarget.reset();
    }

    function removeEmailFromInvites(emailToRemove: string) {
        const newEmailList = emailsToInvite.filter((email) => email !== emailToRemove);
        setEmailsToInvite(newEmailList);
    }

    return (
        <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className="flex flex-col items-center gap-3">
                    <img src={plannerImg} alt="" />
                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>

                <div className="space-y-4">
                    <DestinationAndDateStep
                        isGuestsInputOpen={isGuestsInputOpen}
                        openGuestsInput={openGuestsInput}
                        closeGuestsInput={closeGuestsInput}
                        setDestination={setDestination}
                        eventStartAndEndDates={eventStartAndEndDates}
                        setEventStartAndEndDates={setEventStartAndEndDates}
                    />

                    {isGuestsInputOpen && (
                        <InviteGuestsStep
                            openGuestsModal={openGuestsModal}
                            openConfirmTripModal={openConfirmTripModal}
                            emailsToInvite={emailsToInvite}
                        />
                    )}
                </div>

                <p className="text-small text-zinc-500">
                    Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
                    com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e{' '}
                    <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
                </p>
            </div>

            {isGuestsModalOpen && (
                <InviteGuestsModal
                    emailsToInvite={emailsToInvite}
                    addNewEmailToInvite={addNewEmailToInvite}
                    closeGuestsModal={closeGuestsModal}
                    removeEmailFromInvites={removeEmailFromInvites}
                />
            )}

            {isConfirmTripModalOpen && (
                <ConfirmTripModal
                    trip={trip} // Passa o objeto trip
                    closeConfirmTripModal={closeConfirmTripModal}
                    createTrip={createTrip}
                    setOwnerName={setOwnerName}
                    setOwnerEmail={setOwnerEmail}
                />
            )}
        </div>
    );
}
