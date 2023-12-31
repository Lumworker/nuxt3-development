import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
  collectionGroup,
  Timestamp,
} from "firebase/firestore";
import { firestoreDb } from "./firebase";

export const queryByCollection = async (col: string) => {
  // @ts-ignore
  const colRef = collection(firestoreDb, col);

  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  return docs;
};


export const queryByCollectionCondition = async (col: string,Param:string,condition:string) => {
  // @ts-ignore
  const colRef = collection(firestoreDb, col);

    const q = query(
    colRef,
    where(Param, "==", condition),
  );
  const snapshot = await getDocs(q);
  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  return docs;
};
export const set = async (col: string, document: Object) => {
  await setDoc(doc(collection(firestoreDb, col)), document, { merge: true });
};

export const add = async (col: string, document: Object) => {
  // @ts-ignore
  const colRef = collection(firestoreDb, col);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const del = async (col:string, id:string) => {
  const docRef = doc(firestoreDb, col, id);
  return await deleteDoc(docRef);
};
