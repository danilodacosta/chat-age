import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class BootService {
  constructor(private http: HttpClient) {}

  private accessToken: string;
  private projectId: string;

  getResponse(query: string , session: string) {

    console.log('query -' + query);



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
        `https://dialogflow.googleapis.com/v2beta1/projects/${this.projectId}/agent/sessions/${session}:detectIntent`,
        request,
        config
      );

  }

  public getToken() {
    return this.http
      .get('http://www.mscfilho.net:8080/api/v1/TokenBot/key?AgentName=niobot')
      .pipe(map(response => {

          const token = response.toString().split(',');

          console.log('Object-response : ' + response);
          console.log('AccessToken : ' + token[0].slice(13, token[0].length - 1));
          console.log('IdAgent : ' + token[1].slice(9, token[1].length - 2));

          this.accessToken = token[0].slice(13, token[0].length - 1);
          this.projectId = token[1].slice(9, token[1].length - 2);

      }));
  }

}
