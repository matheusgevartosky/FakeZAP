import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, from, InMemoryCache, split } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = 'https://localhost:7230/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(`[GraphQL errors]`);
    console.log(graphQLErrors)

    if (networkError) {
      console.log(`[Network error]`);
      console.log(networkError);
    }
  });

  const ws = new WebSocketLink({
    uri: `wss://localhost:7230/graphql`,
    options: {
      reconnect: true
    }
  });

  const http = httpLink.create({ uri })

  const link = split(
    ({ query }) => {
      const data = getMainDefinition(query);
      return (
        data.kind === 'OperationDefinition' && data.operation === 'subscription'
      )
    },
    ws,
    http
  )

  return {
    link: from([
      errorLink,
      link
    ]),
    cache: new InMemoryCache()
  }
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
