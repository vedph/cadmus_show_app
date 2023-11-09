import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { ClipboardModule } from '@angular/cdk/clipboard';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { CadmusProfileCoreModule } from '@myrmidon/cadmus-profile-core';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
import { CadmusThesaurusUiModule } from '@myrmidon/cadmus-thesaurus-ui';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { FacetListComponent } from './components/facet-list/facet-list.component';
import { FacetViewComponent } from './components/facet-view/facet-view.component';
import { FlagBitPipe } from './pipes/flag-bit.pipe';
import { FlagDefinitionEditorComponent } from './components/flag-definition-editor/flag-definition-editor.component';
import { FlagListComponent } from './components/flag-list/flag-list.component';
import { FacetMetadataEditorComponent } from './components/facet-metadata-editor/facet-metadata-editor.component';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { ModelLookupComponent } from './components/model-lookup/model-lookup.component';
import { PartDefinitionEditorComponent } from './components/part-definition-editor/part-definition-editor.component';
import { PartInfoComponent } from './components/part-info/part-info.component';

@NgModule({
  declarations: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FlagBitPipe,
    FlagDefinitionEditorComponent,
    FlagListComponent,
    JsonEditorComponent,
    ModelLookupComponent,
    PartDefinitionEditorComponent,
    PartInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    // material
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
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTreeModule,
    ClipboardModule,
    // vendor
    NgJsonEditorModule,
    MarkdownModule,
    CadmusProfileCoreModule,
    CadmusShowUiModule,
    CadmusThesaurusUiModule,
  ],
  exports: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FlagDefinitionEditorComponent,
    FlagListComponent,
    JsonEditorComponent,
    ModelLookupComponent,
    PartDefinitionEditorComponent,
    PartInfoComponent,
  ],
})
export class CadmusProfileUiModule {}
