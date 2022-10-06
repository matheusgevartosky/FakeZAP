import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mensagens: any[] = [];

  SUB = gql`
  subscription Conversa($idConversa: String!) {
    listenConversa (idConversa: $idConversa) {
      texto,
      sender,
      timestamp
    }
  }
  `

  Query = gql`
    query($idConversa : String!) {
    conversa(idConversa: $idConversa) {
      texto,
      sender,
      timestamp
    }
  }
  `
  Mutation = gql`
  mutation($idConversa : String!, $texto : String!, $sender : String!) {
    sendMensagem(idConversa: $idConversa, texto: $texto, sender: $sender)
  }
  `

  constructor(private _apollo: Apollo){}

  ngOnInit(): void {
    this._apollo.subscribe({
      query: this.SUB,
      variables: {
        idConversa: "1"
      }
    }).subscribe((x: any) => {this.mensagens.push(x.data.listenConversa)
    console.log(this.mensagens)
    })

    this._apollo.query({
      query: this.Query,
      variables: {
        idConversa: "1"
      }
    }).subscribe((x: any) => {
      this.mensagens = [...x.data.conversa]
      console.log(this.mensagens)
    })

    this._apollo.mutate({
      mutation: this.Mutation,
      variables: {
        idConversa: "1",
        texto: "Hello World!",
        sender: "Matheus"
      }
    }).subscribe();
  }

}
