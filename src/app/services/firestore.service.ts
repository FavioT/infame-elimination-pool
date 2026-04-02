import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);

  /** Returns a real-time Observable of all documents in a collection. */
  getCollection<T extends DocumentData>(collectionName: string): Observable<T[]> {
    const ref = collection(this.firestore, collectionName) as CollectionReference<T>;
    return collectionData<T>(ref, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error(`Error fetching collection "${collectionName}":`, error);
        throw error;
      })
    );
  }

  /** Returns a real-time Observable for a single document. */
  getDocument<T extends DocumentData>(collectionName: string, docId: string): Observable<T | undefined> {
    const ref = doc(this.firestore, collectionName, docId) as DocumentReference<T>;
    return docData<T>(ref, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error(`Error fetching document "${docId}" in "${collectionName}":`, error);
        throw error;
      })
    );
  }

  /** Adds a new document to a collection and returns a Promise with the new DocumentReference. */
  addDocument(collectionName: string, data: DocumentData): Observable<DocumentReference> {
    const ref = collection(this.firestore, collectionName);
    return from(addDoc(ref, data)).pipe(
      catchError((error) => {
        console.error(`Error adding document to "${collectionName}":`, error);
        throw error;
      })
    );
  }

  /** Updates an existing document by ID. */
  updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>): Observable<void> {
    const ref = doc(this.firestore, collectionName, docId);
    return from(updateDoc(ref, data)).pipe(
      catchError((error) => {
        console.error(`Error updating document "${docId}" in "${collectionName}":`, error);
        throw error;
      })
    );
  }

  /** Deletes a document by ID. */
  deleteDocument(collectionName: string, docId: string): Observable<void> {
    const ref = doc(this.firestore, collectionName, docId);
    return from(deleteDoc(ref)).pipe(
      catchError((error) => {
        console.error(`Error deleting document "${docId}" in "${collectionName}":`, error);
        throw error;
      })
    );
  }
}
