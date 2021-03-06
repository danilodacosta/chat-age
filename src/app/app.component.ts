import { Component, ViewChild, ElementRef } from "@angular/core";
import { BootService } from "./boot.service";

export interface Message {
  remetente?: string;
  mensagem: string;
  data?: Date;
}

export interface Carousel {
  description?: string;
  image: string;
}

export interface Endereco {
  accessibilityText?: string;
  imageUri: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;

  msg = "";
  resultados: Message[];
  carousel: Carousel[];
  sugestoes: string[];
  enderecoClinica: Endereco;
  consultando = true;
  session = this.getSession();

  constructor(private chatBoot: BootService) {
    this.initBoot();
  }

  initBoot() {
    this.resultados = [];

    this.chatBoot.getToken().subscribe(() => {
      this.chatBoot
        .getResponse("oi", this.session)
        .subscribe((response: any) => {
          this.consultando = false;

          // Resposta Boot
          this.resultados.push({
            remetente: "boot",
            mensagem: response.queryResult.fulfillmentText,
            data: new Date()
          });

          // Sugestões
          response.queryResult.fulfillmentMessages.forEach(element => {
            if (element.suggestions) {
              this.sugestoes = [];
              this.carousel = [];
              element.suggestions.suggestions.forEach(sugestao => {
                this.sugestoes.push(sugestao.title);
              });
            }

            // this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
          });
          //  response.queryResult.fulfillmentText.messages.forEach((element) => {
          //   this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
          // });
        });
    });
  }

  sendMessage(sugestao?: string) {
    if (this.msg.length === 0 && sugestao === undefined) {
      return;
    }

    this.sugestoes = [];
    this.carousel = [];
    this.enderecoClinica = null;
    this.consultando = true;
    this.resultados.push({
      remetente: "eu",
      mensagem: sugestao || this.msg,
      data: new Date()
    });

    this.chatBoot
      .getResponse(sugestao || this.msg, this.session)
      .subscribe((response: any) => {
        this.consultando = false;

        console.log(response);

        this.resultados.push({
          remetente: "boot",
          mensagem: response.queryResult.fulfillmentText,
          data: new Date()
        });

        response.queryResult.fulfillmentMessages.forEach(element => {
          /* SUGESTÃO */
          if (element.suggestions) {
            this.sugestoes = [];
            element.suggestions.suggestions.forEach(sugestao => {
              this.sugestoes.push(sugestao.title);
            });
          }

          /* CAROUSEL */
          if (element.carouselSelect) {
            // this.carousel = [];
            element.carouselSelect.items.forEach(item => {
              const carosel = {
                description: item.description,
                image: item.image.imageUri
              };

              this.carousel.push(carosel);
            });
          }

          /* ENDEREÇO */
          if (element.image) {
            const image = {
              accessibilityText: element.image.accessibilityText,
              imageUri: element.image.imageUri
            };
            this.enderecoClinica = image;
            console.log(this.enderecoClinica);
          }

          // this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: response.timestamp })
        });

        /*
        lista.result.fulfillment.messages.forEach((element) => {
          this.resultados.push({ remetente: 'boot', mensagem: element.speech, data: lista.timestamp })
        });
      */
      });

    this.msg = "";
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
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private getSession(): string {
    // tslint:disable-next-line: max-line-length
    return (
      "nio-" +
      new Date().getDate() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getFullYear() +
      "-" +
      "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      ":" +
      new Date().getMilliseconds()
    );
  }
}
