import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/models/app.state';
import { AuthService } from 'src/app/services/auth.service';
import { StartLoading } from 'src/app/state-helpers/actions/loading.actions';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

  $loading!: Observable<boolean>;

  constructor(public authService: AuthService,
    private dialog: MatDialog,
    private store : Store<AppState>) { }

  ngOnInit(): void {
    this.$loading = this.store.select(data => data.loading)
  }

  addNewPost(){
    this.dialog.open(PostDialogComponent)
  }

}
