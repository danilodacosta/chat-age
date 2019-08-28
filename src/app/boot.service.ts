import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class BootService {
  constructor(private http: HttpClient) {}

  private accessToken: string;

  getResponse(query: string) {

    const projectId = 'validacao-1fd22';
    const session = this.getSession();

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

  private getSession(): string {
    // tslint:disable-next-line: max-line-length
    return 'nio-' + new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + '-' + '' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
  }
}
