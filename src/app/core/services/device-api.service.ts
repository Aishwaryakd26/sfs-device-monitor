import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RuntimeConfigService } from '../config/runtime-config.service';
import { OrderInfo } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class DeviceApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(RuntimeConfigService);

  public getDevices(): Observable<string[]> {
    const url = this.configService.resolveUrl('devices');
    return this.http.get<string[]>(url).pipe(
      map(devices => {
        // Sanitize: remove any malformed placeholder strings such as "{deviceId}" from backend
        return (devices || []).filter(d => Boolean(d) && !d.includes('{') && !d.includes('}'));
      })
    );
  }

  public getOrder(orderId: string): Observable<OrderInfo> {
    const url = this.configService.resolveUrl('order', { orderId });
    return this.http.get<OrderInfo>(url);
  }
}
