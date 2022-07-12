import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { PostDialogComponent } from './components/post-dialog/post-dialog.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/http-interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './core/snackbar/snackbar.component'; 
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import { StoreModule } from '@ngrx/store';
import { loading } from './state-helpers/reducers/loading.reducer';

const MATERIAL_MODULES = [
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatProgressBarModule,
]


@NgModule({
  declarations: [
    AppComponent,
    AllPostsComponent,
    PostDialogComponent,
    TopNavbarComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,

   ...MATERIAL_MODULES,
   
   StoreModule.forRoot({ loading}),
  //  StoreModule.forFeature("loading" , loading),
  // StoreModule.forRoot({}),

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, BrowserAnimationsModule // storage
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
