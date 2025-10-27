export default function DeleteUserConfirmationModal() {
  return (
    <div className="border rounded-lg shadow relative">
      <div className="p-6 pt-0 text-center">
        <svg
          className="w-20 h-20 text-red-600 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
          Are you sure you want to delete this user?
        </h3>
        <a
          href="#"
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
        >
          Yes, I'm sure
        </a>
        <a
          href="#"
          className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
        >
          No, cancel
        </a>
      </div>
    </div>
  );
}
