import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// material
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MarkdownModule } from 'ngx-markdown';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusProfileCoreModule } from '@myrmidon/cadmus-profile-core';
import {
  CadmusProfileUiModule,
  RamThesaurusService,
} from '@myrmidon/cadmus-profile-ui';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';
import { CadmusShopCoreModule } from '@myrmidon/cadmus-shop-core';
import { CadmusShopAssetModule } from '@myrmidon/cadmus-shop-asset';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
import { CadmusShowVizModule } from '@myrmidon/cadmus-show-viz';
import { ModelListComponent } from '@myrmidon/cadmus-shop-ui';
import { CadmusThesaurusUiModule } from '@myrmidon/cadmus-thesaurus-ui';

// myrmidon
import { NgxDirtyCheckModule } from '@myrmidon/ngx-dirty-check';

import { AppComponent } from './app.component';
import { DataArchitecturePageComponent } from './components/data-architecture-page/data-architecture-page.component';
import { HomeComponent } from './components/home/home.component';
import { FacetListPageComponent } from './components/facet-list-page/facet-list-page.component';
import { FacetListCodePageComponent } from './components/facet-list-code-page/facet-list-code-page.component';
import { FlagListPageComponent } from './components/flag-list-page/flag-list-page.component';
import { FlagListCodePageComponent } from './components/flag-list-code-page/flag-list-code-page.component';
import { IntroPageComponent } from './components/intro-page/intro-page.component';
import { OverviewPageComponent } from './components/overview-page/overview-page.component';
import { ModelGraphPageComponent } from './components/model-graph-page/model-graph-page.component';
import { ProfileCodePageComponent } from './components/profile-code-page/profile-code-page.component';
import { ProfileFlowComponent } from './components/profile-flow/profile-flow.component';
import { ProfileHomeComponent } from './components/profile-home/profile-home.component';
import { ShopPageComponent } from './components/shop-page/shop-page.component';
import { ThesaurusListPageComponent } from './components/thesaurus-list-page/thesaurus-list-page.component';
import { ThesaurusListCodePageComponent } from './components/thesaurus-list-code-page/thesaurus-list-code-page.component';
import { ThesaurusEditComponent } from './components/thesaurus-edit/thesaurus-edit.component';
import { TextArchitecturePageComponent } from './components/text-architecture-page/text-architecture-page.component';
import { TaxonomiesPageComponent } from './components/taxonomies-page/taxonomies-page.component';
import { InfrastructurePageComponent } from './components/infrastructure-page/infrastructure-page.component';
import { EnvServiceProvider } from '@myrmidon/ng-tools';
import { CadmusMatPhysicalSizeModule } from '@myrmidon/cadmus-mat-physical-size';
import { SemanticGraphPageComponent } from './components/semantic-graph-page/semantic-graph-page.component';
import { ExportPageComponent } from './components/export-page/export-page.component';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';
import { CadmusThesaurusListModule } from '@myrmidon/cadmus-thesaurus-list';
import { ThesaurusService } from '@myrmidon/cadmus-api';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'intro', component: IntroPageComponent },
  { path: 'profile/flow', component: ProfileFlowComponent },
  { path: 'profile/code', component: ProfileCodePageComponent },
  { path: 'profile', component: ProfileHomeComponent },
  {
    path: 'docs/data-architecture',
    component: DataArchitecturePageComponent,
  },
  { path: 'docs/export', component: ExportPageComponent },
  {
    path: 'docs/text-architecture',
    component: TextArchitecturePageComponent,
  },
  { path: 'docs/taxonomies', component: TaxonomiesPageComponent },
  { path: 'docs/infrastructure', component: InfrastructurePageComponent },
  { path: 'docs/semantic-graph', component: SemanticGraphPageComponent },
  { path: 'docs', component: OverviewPageComponent },
  { path: 'models/shop', component: ModelListComponent },
  { path: 'models/graph', component: ModelGraphPageComponent },
  { path: 'models', component: ShopPageComponent },
  { path: 'facets-code', component: FacetListCodePageComponent },
  { path: 'facets-list', component: FacetListPageComponent },
  { path: 'flags-code', component: FlagListCodePageComponent },
  { path: 'flags-list', component: FlagListPageComponent },
  { path: 'thes-code', component: ThesaurusListCodePageComponent },
  { path: 'thes-list', component: ThesaurusListPageComponent },
  { path: 'thesauri/:id', component: ThesaurusEditComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DataArchitecturePageComponent,
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
    OverviewPageComponent,
    TextArchitecturePageComponent,
    TaxonomiesPageComponent,
    InfrastructurePageComponent,
    SemanticGraphPageComponent,
    ExportPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // material
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTreeModule,
    ClipboardModule,
    // vendor
    NgJsonEditorModule,
    MarkdownModule.forRoot(),
    NgxMatFileInputModule,
    // cadmus
    CadmusUiModule,
    CadmusProfileCoreModule,
    CadmusProfileUiModule,
    CadmusRefsHistoricalDateModule,
    CadmusRefsLookupModule,
    CadmusMatPhysicalSizeModule,
    CadmusShopCoreModule,
    CadmusShopAssetModule,
    CadmusShowUiModule,
    CadmusShowVizModule,
    CadmusThesaurusListModule,
    CadmusThesaurusUiModule,
    NgxDirtyCheckModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    EnvServiceProvider,
    // overrides
    {
      provide: ThesaurusService,
      useExisting: RamThesaurusService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
