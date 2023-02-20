import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = '3gzVtkKxi5GgpucFvNY7pgJYstn871hP';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    //Esto no va a funcionar
    // this._historial = localStorage.getItem('historial')

    /* if(localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!)
    } */

    //Combinando los dos anteriores en una sola línea
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = '') {

    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

/*
// Como se haría la petición http en JS con fetch
fetch('https://api.giphy.com/v1/gifs/search?api_key=3gzVtkKxi5GgpucFvNY7pgJYstn871hP&q=Dragon Ball Z&limit=10')
  .then(resp => { resp.json().then(data => console.log(data)) })
*/

    const params = new HttpParams()
              .set('api_key', this.apiKey)
              .set('q', query);

    //Petición realizada con Observables
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((resp) => {
        // console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })


  }
}
