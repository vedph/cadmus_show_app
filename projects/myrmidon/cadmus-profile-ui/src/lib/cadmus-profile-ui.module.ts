import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusProfileCoreModule } from '@myrmidon/cadmus-profile-core';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
import { FacetViewComponent } from './components/facet-view/facet-view.component';
import { FacetMetadataEditorComponent } from './components/facet-metadata-editor/facet-metadata-editor.component';
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { FlagDefinitionEditorComponent } from './components/flag-definition-editor/flag-definition-editor.component';
import { FlagListComponent } from './components/flag-list/flag-list.component';
import { FlagBitPipe } from './pipes/flag-bit.pipe';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { MarkdownModule } from 'ngx-markdown';
import { ModelLookupComponent } from './components/model-lookup/model-lookup.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { PartDefinitionEditorComponent } from './components/part-definition-editor/part-definition-editor.component';
import { PartInfoComponent } from './components/part-info/part-info.component';
import { ThesaurusListComponent } from './components/thesaurus-list/thesaurus-list.component';
import { ThesaurusFilterComponent } from './components/thesaurus-filter/thesaurus-filter.component';
import { ThesaurusEditorComponent } from './components/thesaurus-editor/thesaurus-editor.component';
import { ThesaurusLookupComponent } from './components/thesaurus-lookup/thesaurus-lookup.component';
import { ThesaurusNodeComponent } from './components/thesaurus-node/thesaurus-node.component';

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
    ThesaurusEditorComponent,
    ThesaurusFilterComponent,
    ThesaurusListComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxMatColorPickerModule,
    NgJsonEditorModule,
    // MarkdownModule.forChild(),
    MarkdownModule,
    CadmusMaterialModule,
    CadmusProfileCoreModule,
    CadmusShowUiModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
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
    ThesaurusEditorComponent,
    ThesaurusListComponent,
    ThesaurusFilterComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent,
  ],
})
export class CadmusProfileUiModule {}
