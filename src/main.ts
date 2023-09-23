import {bootstrapApplication} from "@angular/platform-browser";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app/app.routes";
import {BackendInterceptor} from "./app/_helpers/mock-be";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(
      withInterceptors([
        // @ts-ignore
        BackendInterceptor
      ])
    )
  ]
})
