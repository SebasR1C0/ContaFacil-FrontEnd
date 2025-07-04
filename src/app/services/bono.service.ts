import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Bono } from '../models/bono';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { CatalogoMoneda } from '../models/catalogomoneda';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class BonoService {
  private url = `${base_url}/bono`;
  private listacambio = new Subject<Bono[]>();
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Bono[]>(this.url);
  }
  insert(bono: Bono) {
    return this.http.post(this.url, bono);
  }
  setlist(listanueva: Bono[]) {
    this.listacambio.next(listanueva);
  }
  getlist() {
    return this.listacambio.asObservable();
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  update(bono: Bono) {
    return this.http.put(this.url, bono);
  }
  listId(id: number) {
    return this.http.get<Bono>(`${this.url}/${id}`);
  }
  listarxbono(idUser: number) {
    return this.http.get<Bono[]>(`${this.url}/usuario/${idUser}`);
  }
}
