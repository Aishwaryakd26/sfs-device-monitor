import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { apiErrorInterceptor } from './app/core/interceptors/api-error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([apiErrorInterceptor])
    )
  ]
}).catch(err => console.error(err));
