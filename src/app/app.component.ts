import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '@myrmidon/ng-tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public version: string;

  constructor(env: EnvService, router: Router) {
    router.navigate(['/home']);
    this.version = env.get('version') ?? '';
  }
}
