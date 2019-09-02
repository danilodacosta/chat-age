import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class BootService {
  constructor(private http: HttpClient) {}

  private accessToken: string;

  getResponse(query: string , session: string) {

    console.log('query -' + query);

    const projectId = 'validacao-1fd22';

    const config = {
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    const request = {
      queryInput: {
        text: {
          text: `${query}`,
          languageCode: 'pt-br'
        }
      }
    };

    return this.http
      .post(
        `https://dialogflow.googleapis.com/v2beta1/projects/${projectId}/agent/sessions/${session}:detectIntent`,
        request,
        config
      );

  }

  public getToken() {
    return this.http
      .get('http://www.mscfilho.net:8080/api/v1/TokenBot/key?AgentName=niobot')
      .pipe(map(token => this.accessToken = token.toString().slice(6)));
  }

}
