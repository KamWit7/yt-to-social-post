[+] Must zmiana jęzka na polski
[+] poprawa związana z usage przekierownia na seeings
[+] usage i profil połączyć w jedno
[+] obsługa błędów na FE

BIG
[ ] po przejściu do czatu zmiana flow strony

- [+] wklejanie linku
- [+] zmiana modelu/temperatury
- [ ] przejrzeć t3 + google notatki

## CORE

[+] modele od gemini -> zmiana tylko dla BYOK (domyślnie flesh)
[+] poprawić wygląda blokady
[+] przetestować free/byok
[+] sprawdzisć seeting oraz profile
[+] poprawić profil aby pasował do gate przekroczony limit

[+] dodanie temperatury -> tam samo zmiana tylko dla BYOK (pokazywać domyślną)

[?] poprawa wizualna dla osobny przekraczającej limit darmowego konta CEL oraz profil (przeglądnąć)

[+] poprawka dla osoby która nie jest zalgowana [wizualnie FROM Purpose]password

[+] Form Purpose -> krótki stan ładowania skacze ekran -> UsageGate

[+] dodać zapisywanie po udanym fetchu AI

[+] wyczyść nie potrzebne handleSaveState

[+] sprawdzić fonty czy się zgadzaja

[+] rozwiązać TODO

[in_progress] resetowanie użyca po miesiąciu (ostanie TODO)

[+] poprawa aniamcja stan ładowania komponetów

[in_progress] resetowanie hasła 
  [ ] dodanie migracji w github pipeline dla neon 
  [ ] czy wsszystko działa na producji 

[ ] dodanie środowiska developmentu
  [ ] podział bazy danych na lokalny/develop/produkcje
  [ ] usawienie .env na vercelu w odpowiedni sposób 

[ ] add favicon

[ ] dodanie środowiska developmentu

[ ] stworzyć ikone dla strony

[ ] co z cookies?

[ ] test dla zapisywanie w LS kiedy user się zaloguje przedzie propces skopiuje dane z LS i wkleji jak nie jest zalogowany oczekiwany rezulata - endpoint z transkrypcją wali błąd


FIX THIS :
 GET /api/auth/providers 200 in 53ms
 GET /api/auth/csrf 200 in 34ms
[next-auth][error][SIGNIN_OAUTH_ERROR] 
https://next-auth.js.org/errors#signin_oauth_error outgoing request timed out after 3500ms {
  error: {
    message: 'outgoing request timed out after 3500ms',
    stack: 'RPError: outgoing request timed out after 3500ms\n' +
      '    at /home/kamil/yt-to-social-post/.next/server/chunks/node_modules_openid-client_ef38b3be._.js:435:19\n' +
      '    at async Issuer.discover (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_openid-client_ef38b3be._.js:3114:26)\n' +
      '    at async openidClient (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:472:18)\n' +
      '    at async getAuthorizationUrl (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:1859:20)\n' +
      '    at async Object.signin (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:1945:30)\n' +
      '    at async AuthHandler (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:3390:36)\n' +
      '    at async NextAuthRouteHandler (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:3601:30)\n' +
      '    at async NextAuth._args$ (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next-auth_1ad4c44d._.js:3636:24)\n' +
      '    at async AppRouteRouteModule.do (/home/kamil/yt-to-social-post/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38782)\n' +
      '    at async AppRouteRouteModule.handle (/home/kamil/yt-to-social-post/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45984)\n' +
      '    at async responseGenerator (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next_e792bee7._.js:10103:38)\n' +
      '    at async AppRouteRouteModule.handleResponse (/home/kamil/yt-to-social-post/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:183770)\n' +
      '    at async handleResponse (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next_e792bee7._.js:10165:32)\n' +
      '    at async handler (/home/kamil/yt-to-social-post/.next/server/chunks/node_modules_next_e792bee7._.js:10217:13)\n' +
      '    at async doRender (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:1587:34)\n' +
      '    at async DevServer.renderToResponseWithComponentsImpl (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:1929:13)\n' +
      '    at async DevServer.renderPageComponent (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:2395:24)\n' +
      '    at async DevServer.renderToResponseImpl (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:2435:32)\n' +
      '    at async DevServer.pipeImpl (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:1035:25)\n' +
      '    at async NextNodeServer.handleCatchallRenderRequest (/home/kamil/yt-to-social-post/node_modules/next/dist/server/next-server.js:393:17)\n' +
      '    at async DevServer.handleRequestImpl (/home/kamil/yt-to-social-post/node_modules/next/dist/server/base-server.js:925:17)\n' +
      '    at async /home/kamil/yt-to-social-post/node_modules/next/dist/server/dev/next-dev-server.js:398:20\n' +
      '    at async Span.traceAsyncFn (/home/kamil/yt-to-social-post/node_modules/next/dist/trace/trace.js:157:20)\n' +
      '    at async DevServer.handleRequest (/home/kamil/yt-to-social-post/node_modules/next/dist/server/dev/next-dev-server.js:394:24)\n' +
      '    at async invokeRender (/home/kamil/yt-to-social-post/node_modules/next/dist/server/lib/router-server.js:239:21)\n' +
      '    at async handleRequest (/home/kamil/yt-to-social-post/node_modules/next/dist/server/lib/router-server.js:436:24)\n' +
      '    at async requestHandlerImpl (/home/kamil/yt-to-social-post/node_modules/next/dist/server/lib/router-server.js:464:13)\n' +
      '    at async Server.requestListener (/home/kamil/yt-to-social-post/node_modules/next/dist/server/lib/start-server.js:218:13)',
    name: 'RPError'
  },
  providerId: 'google',
  message: 'outgoing request timed out after 3500ms'
}
 POST /api/auth/signin/google 200 in 3553ms
 GET /api/auth/error?error=OAuthSignin 302 in 49ms
 GET /api/auth/signin?error=OAuthSignin 302 in 40ms
 GET /login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F&error=OAuthSignin 200 in 121ms
 GET /api/auth/session 200 in 38ms
