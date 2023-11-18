import { getQuery, H3Event } from "h3";
import { queryByCollection } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
  console.log("🚀 ~ event:", event)
    const query = getQuery(event);
    // console.log("🚀 ~ query:", query)
    // console.log("🚀 ~ query.col:", query.col)
    // const docs = await queryByCollection("ticketStore");
    const docs = await queryByCollection(query.col as string);
    return { result: docs };
  } catch (error: any) {
    return { result: [], error: error.message };
  } 
});
