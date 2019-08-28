import { Component, ViewChild, ElementRef } from '@angular/core';
import { BootService } from './boot.service';

export interface Message {
  remetente?: string;
  mensagem: string;
  data?: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  msg: string;
  resultados: Message[];
  consultando = true;

  constructor(private chatBoot: BootService) {
    this.initBoot();
  }

  initBoot() {
    this.resultados = [];

    this.chatBoot.getToken().subscribe(() => {

      this.chatBoot.getResponse('oi')
      .subscribe((response: any) => {

        this.consultando = false;

        console.log(response);

        this.resultados.push({ remetente: 'boot', mensagem: response.queryResult.fulfillmentText , data: new Date() });

      //  response.queryResult.fulfillmentText.messages.forEach((element) => {
       //   this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
       // });
      });

    });

  }

  sendMessage() {
    this.consultando = true;
    this.resultados.push({ remetente: 'eu', mensagem: this.msg, data: new Date() })
    this.chatBoot.getResponse(this.removerAcentos(this.msg))
      .subscribe((response: any) => {

        this.consultando = false;

        console.log(response);

        this.resultados.push({ remetente: 'boot', mensagem: response.queryResult.fulfillmentText , data: new Date() });

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
    } catch (err) { }
  }

  private removerAcentos(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

}
