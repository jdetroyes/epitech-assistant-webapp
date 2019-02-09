import {Injectable} from '@angular/core';
import * as hello from 'hellojs/dist/hello.all.js';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {
  }

  init() {
    hello.init({
        msft: {
          id: environment.azureApp,
          oauth: {
            version: 2,
            auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
          },
          scope_delim: '',
          form: false
        },
        google: {
          id: environment.googleId,
          oauth: {
            version: 2,
            auth: 'https://accounts.google.com/o/oauth2/auth',
            grant: 'https://accounts.google.com/o/oauth2/token'
          },
        },
        amazon: {
          id: environment.amazonId,
          oauth: {
            version: 2,
            auth: 'https://www.amazon.com/ap/oa',
            grant: 'https://api.amazon.com/auth/o2/token'
          },
          refresh: true,
          scope: {
            basic: 'profile'
          },

          scope_delim: ' ',

          login: function(p) {
            p.options.popup.width = 710;
          },

          base: 'https://api.amazon.com/',

          // There aren't many routes that map to the hello.api so I included me/bikes
          // ... because, bikes
          get: {
            me: 'user/profile'
          },
          wrap: {
            me: function(o, headers) {}
          }
        },
      },
      {redirect_uri: '/dashboard'}
    );
  }

  isAuthenticated(): boolean {
    const session = hello('msft').getAuthResponse();
    const currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
  }

  accessToken(): string {
    const msft = hello('msft').getAuthResponse();
    const accessToken = msft.access_token;
    return accessToken;
  }

  login(): Promise<boolean> {
    return new Promise(((resolve) => {
      hello('msft').login({scope: 'User.Read'}).then(
        () => {
          console.log("Connected office 365 !");
          resolve(true);
        },
        e => {
          console.error(e.error.message);
          resolve(false);
        }
      );
    }));
  }

  logout(): Promise<boolean> {
    return new Promise(((resolve) => {
      hello('msft').logout().then(
        () => {
          // this.router.navigate(['/']);
          resolve(true);
        },
        e => {
          console.error(e.error.message);
          resolve(false);
        }
      );
    }));
  }
}