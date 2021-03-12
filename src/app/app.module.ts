import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnvServiceProvider } from 'projects/myrmidon/cadmus-shop-core/src/lib/services/env.service.provider';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusProfileCoreModule } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import {
  CadmusProfileUiModule,
  ThesaurusEditorComponent,
} from 'projects/myrmidon/cadmus-profile-ui/src/public-api';
import { CadmusShopCoreModule } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { CadmusShopAssetModule } from 'projects/myrmidon/cadmus-shop-asset/src/public-api';
import { CommonModule } from '@angular/common';
import { CadmusShowUiModule } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { GalleryModule } from 'ng-gallery';
import { FacetListPageComponent } from './components/facet-list-page/facet-list-page.component';
import { FacetListCodePageComponent } from './components/facet-list-code-page/facet-list-code-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { FlagListPageComponent } from './components/flag-list-page/flag-list-page.component';
import { FlagListCodePageComponent } from './components/flag-list-code-page/flag-list-code-page.component';
import { ThesaurusListPageComponent } from './components/thesaurus-list-page/thesaurus-list-page.component';
import { ThesaurusListCodePageComponent } from './components/thesaurus-list-code-page/thesaurus-list-code-page.component';
import { ModelListComponent } from 'projects/myrmidon/cadmus-shop-ui/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FacetListPageComponent,
    FacetListCodePageComponent,
    FlagListPageComponent,
    FlagListCodePageComponent,
    ThesaurusListPageComponent,
    ThesaurusListCodePageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    NgJsonEditorModule,
    GalleryModule,
    // markdown
    MarkdownModule.forRoot(),
    CadmusMaterialModule,
    CadmusProfileCoreModule,
    CadmusProfileUiModule,
    CadmusShopCoreModule,
    CadmusShopAssetModule,
    CadmusShowUiModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'models', component: ModelListComponent },
        { path: 'facets-code', component: FacetListCodePageComponent },
        { path: 'facets-list', component: FacetListPageComponent },
        { path: 'flags-code', component: FlagListCodePageComponent },
        { path: 'flags-list', component: FlagListPageComponent },
        { path: 'thes-code', component: ThesaurusListCodePageComponent },
        { path: 'thes-list', component: ThesaurusListPageComponent },
        { path: 'thes/:id', component: ThesaurusEditorComponent },
        { path: '**', component: HomeComponent },
      ],
      {
        initialNavigation: 'enabled',
        useHash: true,
        relativeLinkResolution: 'legacy',
      }
    ),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  providers: [EnvServiceProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
