import { getQuery, H3Event } from "h3";
import { queryByCollectionCondition } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const docs = await queryByCollectionCondition(query.col as string, query.param as string ,query.condition as string);

    return { result: docs };
  } catch (error: any) {
    return { result: [], error: error.message };
  } 
});
