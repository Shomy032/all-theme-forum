import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';
import { finalize, map, Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/models/app.state';
import { FirebaseErrors } from 'src/app/models/firebase.errors.enum';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseHelperService } from 'src/app/services/database-helper.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StartLoading, StopLoading } from 'src/app/state-helpers/actions/loading.actions';
// import { StartLoading, StopLoading } from 'src/app/state-helpers/actions/loading.actions';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { FirebaseCollections } from "./../../models/firebase-collections.interface"

interface Post {
  id : string,
  title : string,
  content : string,
  likes : number,
  userId : string,
  userLiked : string[]
}

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss']
})
export class AllPostsComponent implements OnInit {

  documents$!: Observable<any[]> 
  categories$!: Observable<any>
  allCategories: string[] = [];
  flagsSub!: Subscription;

  constructor(
    private database: DatabaseHelperService,
    private dialog: MatDialog,
    public authService : AuthService,
    private snackbar: SnackbarService,
    private store : Store<AppState>) {
  }

  ngOnInit(){
    this.store.dispatch(StartLoading())
    this.documents$ = this.postCollection.valueChanges({ idField: 'id' })
    .pipe(finalize(() => this.store.dispatch(StopLoading())))

    this.categories$ = this.categoriesCollection.valueChanges()
    .pipe(finalize(() => this.store.dispatch(StopLoading())))

   this.flagsSub = this.categories$
   .pipe(finalize(() => this.store.dispatch(StopLoading())))
   .subscribe(data => {
      this.allCategories = data[0]?.allFlags;
      this.flagsSub?.unsubscribe()
    })
  }

  deletePost(post : any){
    this.store.dispatch(StartLoading())
    this.postCollection
    .doc(post.id)
    .delete()
    .then(res => {
       this.snackbar.openSnackBar("Post deleted successfully.")
     })
    .catch((error : FirebaseError) => {
      if(error.message === FirebaseErrors.NO_PERMISSIONS){
        this.snackbar.openSnackBar("Prmission denied, you are not post owner.")
      }
    })
    .finally(() => {
      this.store.dispatch(StopLoading())
    });
  }

  get postCollection(){
    return this.database.allPostCollection;
  }

  get categoriesCollection(){
    return this.database.categoriesCollection;
  }


  likePost(post : Post){
    const currentUserId = this.authService.getUserId();
    if(!currentUserId){
      this.snackbar.openSnackBar("Please login first.")
      this.authService.GoogleAuth();
      return
    }
    if(post.userId === currentUserId){
      this.snackbar.openSnackBar("Prmission denied, you can not like your posts.")
      return;
    }
    if(post.userLiked?.includes(currentUserId)){
      this.dislikePost(post , currentUserId)
      return;
    }
    this.store.dispatch(StartLoading())
    this.postCollection
    .doc(post.id)
    .update({ likes : (post.likes || 0) + 1 , userLiked : post.userLiked ?  [...post.userLiked, currentUserId] : [currentUserId] })
    .then(res => {
      this.snackbar.openSnackBar("Post liked successfully.")
    })
   .catch((error : FirebaseError) => {
     if(error.message === FirebaseErrors.NO_PERMISSIONS){
       this.snackbar.openSnackBar("Prmission denied, you can not like your posts.")
     }
   })
   .finally(() => {
    this.store.dispatch(StopLoading())
  });;
  }

  dislikePost(post : Post , currentUserId : string){
    const likes = (post.likes || 0) - 1;
    const validLikes = likes < 0 ? 0 : likes;
    const userLiked = [...post.userLiked];
    const index = userLiked?.indexOf(currentUserId);
    if (index > -1) { 
      userLiked?.splice(index, 1); 
    }
    this.postCollection
    .doc(post.id)
    .update({ likes : validLikes , userLiked : userLiked || [] })
    .then(res => {
      this.snackbar.openSnackBar("Post disliked successfully.")
    })
   .catch((error : FirebaseError) => {
     if(error.message === FirebaseErrors.NO_PERMISSIONS){
       this.snackbar.openSnackBar("Prmission denied, you can not like your posts.")
     }
   });
  }

  prepareTitle(title : string) : string{
    if(!title){
      return "";
    }
    const maxLength = 45;
    return title.length < maxLength ? title : title.substring(0 , maxLength) + "..."
  }

  editPost(data : Post){
    this.dialog.open(PostDialogComponent , { data })
  }   
}
