import { AuthService } from './../auth/auth.service';
import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl : './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated =  false;
  private authListenerSubs: Subscription;

   constructor(private authService: AuthService){

   }
   ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
   }

    onLogout() {
      this.authService.logout();
    }

    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
}
