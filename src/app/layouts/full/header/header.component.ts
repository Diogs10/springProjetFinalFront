import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() toggleThemeChange = new EventEmitter<boolean>();
  constructor(
    private authService: AuthService
  ) {}

  isDarkTheme = false;

  // Basculer entre le thème sombre et clair
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;

    const body = document.body;
    body.classList.toggle('m2-define-dark-theme', this.isDarkTheme);
    body.classList.toggle('m2-define-light-theme', !this.isDarkTheme);

    // Émettre l'état du thème sombre
    this.toggleThemeChange.emit(this.isDarkTheme);
  }

  // Activer/Désactiver le mode plein écran
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  logout(){
    this.authService.logout()
  }
}
