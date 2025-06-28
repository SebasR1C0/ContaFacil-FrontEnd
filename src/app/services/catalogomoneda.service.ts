import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { CatalogoMoneda } from '../models/catalogomoneda';
import { HttpClient } from '@angular/common/http';
const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class CatalogomonedaService {
  private url = `${base_url}/catalogo`;
  private listacambio = new Subject<CatalogoMoneda[]>();
  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<CatalogoMoneda[]>(this.url);
  }
  setlist(listanueva: CatalogoMoneda[]){
    this.listacambio.next(listanueva);
  }
  getlist(){
    return this.listacambio.asObservable();
  }
}
