import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { BootService } from './boot.service';

import * as $ from 'jquery';

export interface Message {
  remetente?: string;
  mensagem: string;
  data?: Date;
}

export interface Carrosel {
  description?: string;
  image: string;  
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  msg: string;
  resultados: Message[];
  sugestoes: string[];
  consultando = true;
  session = this.getSession();

  constructor(private chatBoot: BootService, private ngZone: NgZone) {
    this.initBoot();
      
  }

  initBoot() {
    this.resultados = [];

    this.chatBoot.getToken().subscribe(() => {
      this.chatBoot
        .getResponse('oi', this.session)
        .subscribe((response: any) => {
          this.consultando = false;
          
          // Resposta Boot
          this.resultados.push({
            remetente: 'boot',
            mensagem: response.queryResult.fulfillmentText,
            data: new Date()
          });

          // Sugestões
          response.queryResult.fulfillmentMessages.forEach(element => {
            if (element.suggestions) {
              this.sugestoes = [];
                element.suggestions.suggestions.forEach(sugestao => {
                  this.sugestoes.push(sugestao.title);
              });
            }

            //this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
          });
          //  response.queryResult.fulfillmentText.messages.forEach((element) => {
          //   this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
          // });
        });
     });
  }

  sendMessage(msg?: string) {

    this.sugestoes = [];
    this.consultando = true;
    this.resultados.push({
      remetente: 'eu',
      mensagem: msg || this.msg,
      data: new Date()
    });

    this.chatBoot
      .getResponse(msg || this.msg, this.session)
      .subscribe((response: any) => {
        this.consultando = false;

        console.log(response);

        this.resultados.push({
          remetente: 'boot',
          mensagem: response.queryResult.fulfillmentText,
          data: new Date()
        });


  // Sugestões
  response.queryResult.fulfillmentMessages.forEach(element => {
    if (element.suggestions) {
      this.sugestoes = [];
        element.suggestions.suggestions.forEach(sugestao => {
          this.sugestoes.push(sugestao.title);
      });
    }

    //this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
  });


        /*
        lista.result.fulfillment.messages.forEach((element) => {
          this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: lista.timestamp })
        });
      */
      });

    this.msg = '';
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewChecked() {
    this.scrollToBottom();    
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private removerAcentos(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private getSession(): string {
    // tslint:disable-next-line: max-line-length
    return (
      'nio-' +
      new Date().getDate() +
      '-' +
      new Date().getMonth() +
      '-' +
      new Date().getFullYear() +
      '-' +
      '' +
      new Date().getHours() +
      ':' +
      new Date().getMinutes() +
      ':' +
      new Date().getSeconds() +
      ':' +
      new Date().getMilliseconds()
    );
  }

  private initCarrosel(){
    $(document).ready(function(){

      console.log("jquery is ready")
    
      $("#btn-news-prev").click(function(){
        $('.carousel').carousel('prev');
        });
    
        $("#btn-news-next").click(function(){
        $('.carousel').carousel('next');
        });
    
    });
  }


  public alerta() {
  
  }

}
