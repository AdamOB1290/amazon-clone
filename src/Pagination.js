import React from "react";

export const Pagination = ({
  productsPerPage,
  totalProducts,
  paginate,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className="mx-auto">
      <ul className="relative z-0 inline-flex shadow-sm">
        <li
          onClick={() => {
            setCurrentPage((currentPage) => currentPage - 1);
            if (currentPage <= 1) {
              setCurrentPage(1);
            }
          }}
          className={`relative inline-flex cursor-pointer items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium hover:text-gray-500 focus:z-10 focus:outline-none ${
            currentPage <= 1 ? "text-gray-400" : "text-gray-700"
          }`}
          aria-label="Previous"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
        {pageNumbers.map((number) => (
          <li
            onClick={() => paginate(number)}
            key={number}
            className={`-ml-px relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium focus:z-10 focus:outline-none ${
              currentPage == number
                ? "bg-yellow-600	 text-white"
                : "text-gray-700 hover:text-gray-500"
            }`}
          >
            {number}
          </li>
        ))}
        <li
          onClick={() => {
            setCurrentPage((currentPage) => currentPage + 1);
            if (currentPage >= pageNumbers.length) {
              setCurrentPage(pageNumbers.length);
            }
          }}
          className={`-ml-px relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium hover:text-gray-500 focus:z-10 focus:outline-none ${
            currentPage >= pageNumbers.length
              ? "text-gray-400"
              : "text-gray-700"
          }`}
          aria-label="Next"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
