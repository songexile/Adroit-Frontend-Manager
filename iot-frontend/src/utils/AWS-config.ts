const awsConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
      // loginWith: { // Optional
      //   oauth: {
      //     domain: 'abcdefghij1234567890-29051e27.auth.us-east-1.amazoncognito.com',
      //     scopes: ['openid email phone profile aws.cognito.signin.user.admin '],
      //     redirectSignIn: ['http://localhost:3000/', 'https://example.com/'],
      //     redirectSignOut: ['http://localhost:3000/', 'https://example.com/'],
      //     responseType: 'code',
      //   }
      //   username: 'true',
      //   email: 'false', // Optional
      //   phone: 'false', // Optional
      // }
    }
  }
};

export default awsConfig;
