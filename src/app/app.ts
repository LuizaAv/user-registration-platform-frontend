import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HttpClientModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})

export class App implements OnInit {
  protected readonly title = signal('user-registration-platform');

  ngOnInit() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}
