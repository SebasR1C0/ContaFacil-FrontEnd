import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { ResultadosFinancieros } from '../models/resultados';
import { HttpClient } from '@angular/common/http';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  private url = `${base_url}/resultados`;
  private rfinanciero = new Subject<ResultadosFinancieros[]>();

  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<ResultadosFinancieros[]>(this.url);
  }

  setlist(listanueva: ResultadosFinancieros[]){
      this.rfinanciero.next(listanueva);
    }
  getlist(){
      return this.rfinanciero.asObservable();
    }

  listId(id:number){
      return this.http.get<ResultadosFinancieros>(`${this.url}/${id}`)
    }

  listarxbono(idBono: number){
      return this.http.get<ResultadosFinancieros[]>(`${this.url}/resultadoxbono/${idBono}`);
    }    
}
