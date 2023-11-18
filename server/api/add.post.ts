import { getQuery, readBody } from "h3";
import { add } from "../lib/firestore";

export default defineEventHandler(async (event) => {
  try {
  console.log("🚀 ~ event:", event)

    const query = getQuery(event);
    const body = await readBody(event);
    const docRef = await add(query.col as string, body as any);

    return { result: docRef };
  } catch (error : any) {
    return { result: [], error: error.message  };
  }
});
