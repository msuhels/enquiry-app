type Update = {
    id: string;
    title: string;
    update_type?: string;
};

type Props = {
    update: Update;
    onClose: () => void;
    onDelete: (update: Update) => void;
};

export default function DeleteUpdateConfirmationModal({
    update,
    onClose,
    onDelete,
}: Props) {
    return (
        <div className="border rounded-lg shadow relative p-2">
            <div className="p-6 pt-0 text-center">
                <svg
                    className="w-10 h-10 text-red-600 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                    Are you sure you want to delete this update?
                </h3>
                <ul className="w-full text-start mb-3">
                    <li className="text-base text-gray-500">
                        <span className="font-semibold text-gray-900">Title:</span>{" "}
                        {update.title || "N/A"}
                    </li>
                    <li className="text-base text-gray-500">
                        <span className="font-semibold text-gray-900">Type:</span>{" "}
                        {update.update_type}
                    </li>
                </ul>
                <div
                    onClick={() => onDelete(update)}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 cursor-pointer"
                >
                    Yes, I'm sure
                </div>
                <div
                    onClick={onClose}
                    className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center cursor-pointer"
                >
                    No, cancel
                </div>
            </div>
        </div>
    );
}
