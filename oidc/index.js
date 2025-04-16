import { OAuth2Server } from 'oauth2-mock-server';

let server = new OAuth2Server();

// Generate a new RSA key and add it to the keystore
await server.issuer.keys.generate('RS256');

// Start the server
await server.start(8080, 'localhost');
console.log('Issuer URL:', server.issuer.url); // -> http://localhost:8080

const SUB = '12345678';
const DV = '9';

server.service.on('beforeUserinfo', (userInfoResponse, req) => {
  console.log('handle beforeUserinfo event');
  userInfoResponse.body = {
    sub: SUB,
    RolUnico: {
      DV: DV,
      numero: Number(SUB),
      tipo: 'RUN'
    },
    name: {
      apellidos: ['Del Río', 'Gonzalez'],
      nombres: ['María', 'Carmen']
    }
  };
});

server.service.on('beforeAuthorizeRedirect', (authorizeRedirectUri, req) => {
  console.log('handle beforeAuthorizeRedirect event');
});

server.service.on('beforeTokenSigning', (token, req) => {
  console.log('handle beforeTokenSigning event');
  console.log('token:', token);

  token.payload.sub = SUB;
});

// Force the oidc service to provide an invalid_grant response
// on next call to the token endpoint
server.service.on('beforeResponse', (tokenEndpointResponse, req) => {
  console.log('handle beforeResponse event', tokenEndpointResponse);
});