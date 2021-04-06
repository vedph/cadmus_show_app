import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusProfileCoreModule } from '@myrmidon/cadmus-profile-core';
import {
  CadmusProfileUiModule,
  ThesaurusEditorComponent,
} from '@myrmidon/cadmus-profile-ui';
import { CadmusShopCoreModule } from '@myrmidon/cadmus-shop-core';
import { CadmusShopAssetModule } from '@myrmidon/cadmus-shop-asset';
import { CommonModule } from '@angular/common';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
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
import { ModelListComponent } from '@myrmidon/cadmus-shop-ui';
import { ShopPageComponent } from './components/shop-page/shop-page.component';
import { NgTickerModule } from 'ng-ticker';
import { EnvServiceProvider } from '@myrmidon/cadmus-core';

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
    ShopPageComponent,
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
    NgTickerModule,
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
        { path: 'shop', component: ShopPageComponent },
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
