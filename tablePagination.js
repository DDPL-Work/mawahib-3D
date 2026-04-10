export const MIN_TABLE_ROWS = 10;

export const clampPage = (page, totalPages) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safePage = Math.max(1, Number(page) || 1);
  return Math.min(safePage, safeTotalPages);
};

export const paginateItems = (items, page, pageSize = MIN_TABLE_ROWS) => {
  const safePageSize = Math.max(MIN_TABLE_ROWS, Number(pageSize) || MIN_TABLE_ROWS);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = clampPage(page, totalPages);
  const sliceStart = (currentPage - 1) * safePageSize;
  const pageItems = items.slice(sliceStart, sliceStart + safePageSize);

  return {
    currentPage,
    pageItems,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    startIndex: totalItems === 0 ? 0 : sliceStart + 1,
    endIndex: totalItems === 0 ? 0 : sliceStart + pageItems.length,
    emptyRows: Math.max(0, safePageSize - pageItems.length),
  };
};

export const getPaginationWindow = (currentPage, totalPages, maxVisible = 5) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = clampPage(currentPage, safeTotalPages);
  const visibleCount = Math.max(1, Math.floor(Number(maxVisible) || 5));
  const half = Math.floor(visibleCount / 2);

  let start = Math.max(1, safeCurrentPage - half);
  let end = Math.min(safeTotalPages, start + visibleCount - 1);

  start = Math.max(1, end - visibleCount + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};
