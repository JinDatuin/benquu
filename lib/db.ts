import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export async function getUserByEmail(email: string) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as {
    id: string;
    email: string;
    password: string;
    name: string;
  };
}

export async function createUser(name: string, email: string, password: string) {
  const ref = await addDoc(collection(db, 'users'), {
    name,
    email,
    password,
    created_at: Timestamp.now(),
  });
  return ref.id;
}

export async function getNotesByUser(userId: string) {
  const q = query(
    collection(db, 'notes'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createNote(userId: string, title: string, content: string) {
  const ref = await addDoc(collection(db, 'notes'), {
    user_id: userId,
    title,
    content,
    created_at: Timestamp.now(),
  });
  return ref.id;
}

export async function deleteNote(noteId: string, userId: string) {
  const ref = doc(db, 'notes', noteId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().user_id !== userId) return false;
  await deleteDoc(ref);
  return true;
}
