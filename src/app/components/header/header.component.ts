import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  authStatusListenerSub: Subscription;
  isAuthenticated = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy(){
    this.authStatusListenerSub.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }

}
