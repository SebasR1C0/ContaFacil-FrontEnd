import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { User } from '../models/users';
import { HttpClient } from '@angular/common/http';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = `${base_url}/users`;
  private listacambio = new Subject<User[]>();
  
  constructor(private http:HttpClient) { }
  list(){
      return this.http.get<User[]>(this.url);
    }
  listId(id:number){
    return this.http.get<User>(`${this.url}/${id}`)
  }
}
