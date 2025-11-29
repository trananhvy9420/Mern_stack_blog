import { Model, Document } from "mongoose";
interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
export const getPaginatedData = async <T extends Document>(
  model: Model<T> | any,
  queryParams: any,
  filter: any = {},
  options: { sort?: any; populate?: any } = {}
): Promise<PaginationResult<T>> => {
  const page = parseInt(queryParams.page as string, 10) || 1;
  const limit = parseInt(queryParams.limit as string, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  let queryBuilder = model.find(filter).sort(sort).skip(skip).limit(limit);
  if (options.populate) {
    queryBuilder = queryBuilder.populate(options.populate);
  }
  const [data, totalRecords] = await Promise.all([
    queryBuilder.lean(),
    model.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalRecords / limit);
  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
    },
  };
};
