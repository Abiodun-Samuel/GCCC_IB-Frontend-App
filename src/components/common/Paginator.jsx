const Paginator = ({ paginationData, limit = 4, onPageChange }) => {
  if (!paginationData?.links || paginationData.links.length === 0) return null;

  const { links, current_page, from, to, total } = paginationData;

  const getPaginatedLinks = (links, currentPage, limit) => {
    const totalPages = links.length;
    const current = Number(currentPage);

    const result = [];
    result.push(links[0]); // "Previous" button

    const start = Math.max(current - limit, 2);
    const end = Math.min(current + limit, totalPages - 1);

    if (start > 2) result.push({ label: "...", url: null });

    for (let i = start; i <= end; i++) {
      result.push(links[i - 1]);
    }

    if (end < totalPages - 1) result.push({ label: "...", url: null });
    if (totalPages > 1) result.push(links[totalPages - 1]); // "Next" button

    return result;
  };

  const firstLinkItem = links[0];
  const lastLinkItem = links[links.length - 1];
  const linksToBePaginated = links.slice(1, -1);
  const paginatedLinks = getPaginatedLinks(linksToBePaginated, current_page, limit);
  const totalLinks = [firstLinkItem, ...paginatedLinks, lastLinkItem];

  const handleClick = (link) => {
    if (!link?.url || link.label === current_page) return;

    try {
      const urlObject = new URL(link.url);
      const queryParams = new URLSearchParams(urlObject.search);
      const page = queryParams.get("page");
      onPageChange(Number(page));
    } catch (error) {
    }
  };

  return (
    <div className="py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Pagination Info */}
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold mx-1">{from ?? 0}</span> to
            <span className="font-semibold mx-1">{to ?? 0}</span> of
            <span className="font-semibold mx-1">{total ?? 0}</span> results
          </p>
        </div>

        {/* Pagination Controls */}
        <nav className="isolate -space-x-px rounded-md shadow-xs" aria-label="Pagination">
          {totalLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleClick(link)}
              disabled={!link?.url}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`relative text-sm font-semibold px-4 py-2 inline-flex items-center 
                focus:z-20
                ${link.label.includes("Previous")
                  ? "rounded-l-md ring-1 ring-gray-300 hover:bg-gray-50"
                  : link.label.includes("Next")
                    ? "rounded-r-md ring-1 ring-gray-300 hover:bg-gray-50"
                    : link.active
                      ? "bg-green-600 text-white z-10"
                      : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                }
                disabled:text-gray-400 disabled:cursor-not-allowed`}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Paginator;


// const Paginator = ({ paginationData, limit = 4, setPage, type = false }) => {

//   function getPaginatedLinks(links, currentPage, limit) {
//     const totalPages = links.length;
//     const current = Number(currentPage);
//     const pages = links.map((link) => Number(link.label));
//     const result = [];
//     result.push(links[0]);
//     let start = Math.max(current - limit, 2);
//     let end = Math.min(current + limit, totalPages - 1);
//     if (start > 2) result.push({ label: "...", url: null });
//     for (let i = start; i <= end; i++) {
//       result.push(links[i - 1]);
//     }
//     if (end < totalPages - 1) result.push({ label: "...", url: null });
//     if (totalPages > 1) result.push(links[totalPages - 1]);
//     return result;
//   }

//   let totalLinks = []
//   const links = paginationData?.links

//   if (links?.length >= 0) {
//     // note, both next and prev is not needed in the link manipulation
//     const firstLinkItem = links[0]; //previous link
//     const lastLinkItem = links[links.length - 1]; //next link

//     const linksToBePaginated = links?.slice(1, -1);
//     const paginatedLinks = getPaginatedLinks(linksToBePaginated, paginationData?.current_page, limit);

//     totalLinks = [firstLinkItem, ...paginatedLinks, lastLinkItem]
//   }

//   const handleFetchData = async (link) => {
//     if (link?.label == paginationData?.current_page) return;
//     const urlObject = new URL(link?.url);
//     const queryParams = new URLSearchParams(urlObject.search);
//     const page = queryParams.get("page");
//     if (type) {
//       setPage(null, page)
//     } else {
//       setPage(page)
//     }
//   };

//   return (
//     <>
//       {links?.length >= 0 &&
//         <div className="py-3">
//           <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing
//                 <span className="font-semibold mx-1">{paginationData?.from ?? 0}</span>
//                 to
//                 <span className="font-semibold mx-1">{paginationData?.to ?? 0}</span>
//                 of
//                 <span className="font-semibold mx-1">{paginationData?.total ?? 0}</span>
//                 results
//               </p>
//             </div>
//             <div>
//               <nav className="isolate -space-x-px rounded-md shadow-xs" aria-label="Pagination">
//                 {totalLinks?.map((link, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleFetchData(link)}
//                     disabled={!link?.url}
//                     dangerouslySetInnerHTML={{ __html: link?.label }}
//                     aria-current="page"
//                     className={`relative disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-semibold px-4 py-2 inline-flex items-center focus:z-20 ${link?.label?.includes("Previous")
//                       ? "rounded-l-md  ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0"
//                       : link?.label?.includes("Next")
//                         ? "rounded-r-md  ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0"
//                         : link?.active
//                           ? "bg-green-600 focus-visible:outline-green-600 z-10 text-white focus-visible:outline-2 focus-visible:outline-offset-2"
//                           : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0"
//                       }`}
//                   ></button>
//                 ))}
//               </nav>
//             </div>
//           </div>
//         </div>
//       }
//     </>
//   );
// };

// export default Paginator;
