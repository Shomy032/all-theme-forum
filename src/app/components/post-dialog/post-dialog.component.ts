import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseError } from 'firebase/app';
import { finalize, Observable, Subscription } from 'rxjs';
import { FirebaseCollections } from 'src/app/models/firebase-collections.interface';
import { FirebaseErrors } from 'src/app/models/firebase.errors.enum';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseHelperService } from 'src/app/services/database-helper.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.scss']
})
export class PostDialogComponent implements OnInit {

  form!: FormGroup;
  data;

  loginError = "Please login first!"

  categories$!: Observable<any>
  allCategories: string[] = [];
  flagsSub! : Subscription;
  loading = false;

  
  constructor(private database: DatabaseHelperService , 
    private dialogRef : DialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data : any,
    private authService : AuthService,
    private snackbar : SnackbarService) {
      this.data = data || {};
  }

  ngOnInit(): void {
    this.getStaticData();
    this.initForm();
  }

  getStaticData(){
    this.startLoading()
    this.categories$ = this.categoriesCollection.valueChanges()
    .pipe(finalize(() => this.stopLoading()))

    this.startLoading()
    this.flagsSub = this.categories$.subscribe(data => {
      this.allCategories = data[0]?.allFlags;
      this.flagsSub?.unsubscribe()
      this.stopLoading()
    })
  }

  initForm(){
    this.form = new FormGroup({
      "title" : new FormControl("" , [Validators.required]),
      "content" : new FormControl("" , [Validators.required])
    })

    if(this.data.id){
      this.form.patchValue(this.data);
    }
  }

  startLoading(){
    this.loading = true
  }

  stopLoading(){
    this.loading = false
  }

  get categoriesCollection(){
    return this.database.categoriesCollection;
  }

  addPost(){
    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    this.startLoading()
    if(this.data.id){
      this.postCollection
      .doc(this.data.id)
      .update(this.form.getRawValue())
      .then(res => {
        this.dialogRef.close()
      })
     .catch((error : FirebaseError) => {
        if(error.message === FirebaseErrors.NO_PERMISSIONS){
          this.snackbar.openSnackBar("Prmission denied, you are not post owner.")
        }
        
        this.form.markAllAsTouched();
     })
     .finally(() => {
      this.stopLoading()
     });
     return
    }

    this.startLoading()
   this.postCollection
    .add({
      ...this.form.getRawValue(),
      userId : this.authService.getUserId(),
      likes : 0,
      userLiked : [] })
    .then(res => {
      this.dialogRef.close()
    })
   .catch((error : FirebaseError) => {
    if(error.message === FirebaseErrors.NO_PERMISSIONS){
      this.snackbar.openSnackBar(this.loginError)
      this.authService.GoogleAuth()
    }
      this.form.markAllAsTouched();
   })
   .finally(() => {
    this.stopLoading()
   });
  }

  get postCollection(){
    return this.database.allPostCollection
  }
}
