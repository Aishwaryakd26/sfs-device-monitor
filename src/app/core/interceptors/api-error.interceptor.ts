import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../notifications/notification.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    // The core service is unstable and periodically produces errors.
    // Retry once automatically for transient network blips
    retry({ count: 1, delay: 500 }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred while contacting the server.';

      if (error.status === 0) {
        errorMessage = 'Network connection failure. Unable to reach API server.';
      } else if (error.status >= 500) {
        errorMessage = `Core service failure (HTTP ${error.status}). Server temporarily unavailable.`;
      } else if (error.status === 404) {
        errorMessage = `Resource not found (HTTP 404) for request: ${req.url}`;
      } else {
        errorMessage = error.error?.message || error.statusText || `Request error (HTTP ${error.status})`;
      }

      // Display user-friendly notification
      notificationService.notifyError('API Communication Error', errorMessage);

      return throwError(() => error);
    })
  );
};
