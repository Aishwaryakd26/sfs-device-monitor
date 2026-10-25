import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { catchError, map, switchMap, tap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { AppConfig } from '../models/app.models';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  private readonly baseUrl = 'https://mock-api.assessment.sfsdm.org';
  
  // Default fallback configuration
  private readonly defaultConfig: AppConfig = {
    availableLanguages: ['en', 'de'],
    environment: 'test',
    environmentColour: 'blue',
    environmentName: '[TEST]',
    endpoints: {
      config: '/config',
      devices: '/devices',
      events: '/events/{deviceId}',
      order: '/order/{orderId}'
    }
  };

  private readonly configSubject = new BehaviorSubject<AppConfig>(this.defaultConfig);
  public readonly config$: Observable<AppConfig> = this.configSubject.asObservable();

  constructor() {
    this.startConfigPolling();
  }

  public get currentConfig(): AppConfig {
    return this.configSubject.value;
  }

  public resolveUrl(endpointKey: keyof AppConfig['endpoints'], params?: Record<string, string>): string {
    const endpoints = this.currentConfig.endpoints;
    let path = endpoints[endpointKey] || `/${endpointKey}`;
    
    if (params) {
      Object.keys(params).forEach(param => {
        path = path.replace(`{${param}}`, params[param]);
      });
    }

    // Prefix base URL if not absolute
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private startConfigPolling(): void {
    // Poll every 15 seconds to fulfill requirement:
    // "Since there is no way of ensuring an application reload in production, the configuration has to be updated during runtime automatically."
    timer(0, 15000).pipe(
      switchMap(() => this.http.get<AppConfig>(`${this.baseUrl}/config`).pipe(
        catchError(err => {
          // Non-blocking: fail quietly or inform toast if critical
          console.warn('Failed to refresh runtime configuration, retaining cached config', err);
          return of(null);
        })
      )),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(newConfig => {
      if (newConfig) {
        const oldEnv = this.configSubject.value.environmentName;
        this.configSubject.next(newConfig);
        if (oldEnv !== newConfig.environmentName) {
          this.notificationService.notifyInfo(
            'Environment Updated',
            `Running environment updated to ${newConfig.environmentName}`
          );
        }
      }
    });
  }
}
