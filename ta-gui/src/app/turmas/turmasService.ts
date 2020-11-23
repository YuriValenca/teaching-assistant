import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';

@Injectable()
export class TurmasService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTurmas(): Observable<string[]> {
    return this.http.get<string[]>(this.taURL + "/turmas")
              .pipe(
                 retry(2)
               );
  }

}