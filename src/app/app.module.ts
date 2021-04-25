import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { MarkdownModule } from 'ngx-markdown';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusProfileCoreModule } from '@myrmidon/cadmus-profile-core';
import { NgTickerModule } from 'ng-ticker';
import { CadmusProfileUiModule } from '@myrmidon/cadmus-profile-ui';
import { CadmusShopCoreModule } from '@myrmidon/cadmus-shop-core';
import { CadmusShopAssetModule } from '@myrmidon/cadmus-shop-asset';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
import { CadmusShowVizModule } from '@myrmidon/cadmus-show-viz';

import { environment } from '../environments/environment';
import { EnvServiceProvider } from '@myrmidon/cadmus-core';

import { AppComponent } from './app.component';
import { ComplexModelsComponent } from './components/complex-models/complex-models.component';
import { HomeComponent } from './components/home/home.component';
import { FacetListPageComponent } from './components/facet-list-page/facet-list-page.component';
import { FacetListCodePageComponent } from './components/facet-list-code-page/facet-list-code-page.component';
import { FlagListPageComponent } from './components/flag-list-page/flag-list-page.component';
import { FlagListCodePageComponent } from './components/flag-list-code-page/flag-list-code-page.component';
import { ModelListComponent } from '@myrmidon/cadmus-shop-ui';
import { ProfileFlowComponent } from './components/profile-flow/profile-flow.component';
import { ProfileHomeComponent } from './components/profile-home/profile-home.component';
import { ShopPageComponent } from './components/shop-page/shop-page.component';
import { ThesaurusListPageComponent } from './components/thesaurus-list-page/thesaurus-list-page.component';
import { ThesaurusListCodePageComponent } from './components/thesaurus-list-code-page/thesaurus-list-code-page.component';
import { ThesaurusEditComponent } from './components/thesaurus-edit/thesaurus-edit.component';
import { ProfileCodePageComponent } from './components/profile-code-page/profile-code-page.component';
import { ModelGraphPageComponent } from './components/model-graph-page/model-graph-page.component';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntroPageComponent } from './components/intro-page/intro-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ComplexModelsComponent,
    HomeComponent,
    FacetListPageComponent,
    FacetListCodePageComponent,
    FlagListPageComponent,
    FlagListCodePageComponent,
    ProfileFlowComponent,
    ProfileHomeComponent,
    ThesaurusEditComponent,
    ThesaurusListPageComponent,
    ThesaurusListCodePageComponent,
    ShopPageComponent,
    ProfileCodePageComponent,
    ModelGraphPageComponent,
    IntroPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgJsonEditorModule,
    // markdown
    MarkdownModule.forRoot(),
    NgTickerModule,
    NgxMatFileInputModule,
    // https://hakimio.github.io/ngx-ui-tour/
    TourMatMenuModule.forRoot(),
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusProfileCoreModule,
    CadmusProfileUiModule,
    CadmusShopCoreModule,
    CadmusShopAssetModule,
    CadmusShowUiModule,
    CadmusShowVizModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'intro', component: IntroPageComponent },
        { path: 'profile', component: ProfileHomeComponent },
        { path: 'profile/flow', component: ProfileFlowComponent },
        { path: 'profile/code', component: ProfileCodePageComponent },
        { path: 'docs/complex-models', component: ComplexModelsComponent },
        { path: 'models', component: ShopPageComponent },
        { path: 'models/shop', component: ModelListComponent },
        { path: 'models/graph', component: ModelGraphPageComponent},
        { path: 'facets-code', component: FacetListCodePageComponent },
        { path: 'facets-list', component: FacetListPageComponent },
        { path: 'flags-code', component: FlagListCodePageComponent },
        { path: 'flags-list', component: FlagListPageComponent },
        { path: 'thes-code', component: ThesaurusListCodePageComponent },
        { path: 'thes-list', component: ThesaurusListPageComponent },
        { path: 'thes/:id', component: ThesaurusEditComponent },
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
