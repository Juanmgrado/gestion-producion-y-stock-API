import { DEFAULT_PAGE, LIMIT_PAGE } from "./conts.js";

export const pagination = (page?: number, limit?: number) => {
    
  const currentPage = Number(page ?? DEFAULT_PAGE);
  const currentLimit = Number(limit ?? LIMIT_PAGE);

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - DEFAULT_PAGE) * currentLimit,
  };
};
