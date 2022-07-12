import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseCollections } from '../models/firebase-collections.interface';

type Instance = "app" | "helper" | "cache" | "logs";

@Injectable({
  providedIn: 'root'
})
export class DatabaseHelperService {

  instance : Instance  = "app";

  constructor(private database: AngularFirestore) { }

  get allPostCollection(){
    return this.database.collection(`/${this.instance}/${location.hostname}/${FirebaseCollections.POSTS}` , this.orderByLikesDefaultLimit);
  }

  get categoriesCollection(){
    return this.database.collection(`/${this.instance}/${location.hostname}/${FirebaseCollections.CATEGORIES}`);
  }

  get orderByLikesDefaultLimit(){
    return (ref : any) => ref.orderBy("likes" , "desc").limit(25)
  }
}
