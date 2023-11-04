import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
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
    NgJsonEditorModule,
    MarkdownModule,
    CadmusMaterialModule,
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
