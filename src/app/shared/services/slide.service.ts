import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  baseUrl = this.env.apiUrl + '/api/Slide/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  getAll() {
    return this.http.get(this.baseUrl);
  }

  getById(id: any) {
    return this.http.get(this.baseUrl + id);
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  update(data: any) {
    return this.http.put(this.baseUrl, data);
  }

  ChangePosition(data: any[]) {
    return this.http.put(this.baseUrl + 'ChangePosition', data);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + id);
  }
}
