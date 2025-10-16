import React from "react";

interface Client {
    id: number;
    clientName: string;
    projectTitle: string;
    completionDate: string;
    description: string;
}

interface ClientCardProps {
    client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({client}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-800">{client.clientName}</h4>
            <p className="text-gray-600 text-sm font-semibold mt-1">{client.projectTitle}</p>
            <p className="text-gray-500 text-sm">Completed: {client.completionDate}</p>
            <p className="text-gray-600 text-sm mt-2">{client.description}</p>
        </div>
    );
};

export default ClientCard;