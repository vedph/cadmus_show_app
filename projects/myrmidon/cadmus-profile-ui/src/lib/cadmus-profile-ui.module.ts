import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusProfileCoreModule } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { CadmusShowUiModule } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
import { FacetViewComponent } from './components/facet-view/facet-view.component';
import { FacetMetadataEditorComponent } from './components/facet-metadata-editor/facet-metadata-editor.component';
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { FacetListCodeComponent } from './components/facet-list-code/facet-list-code.component';
import { PartDefinitionEditorComponent } from './components/part-definition-editor/part-definition-editor.component';
import { ModelLookupComponent } from './components/model-lookup/model-lookup.component';
import { PartInfoComponent } from './components/part-info/part-info.component';
import { ScreenGalleryComponent } from './components/screen-gallery/screen-gallery.component';
import { GalleryModule } from 'ng-gallery';
import { MarkdownModule } from 'ngx-markdown';
import { FlagDefinitionEditorComponent } from './components/flag-definition-editor/flag-definition-editor.component';
import { FlagListComponent } from './components/flag-list/flag-list.component';
import { FlagBitPipe } from './pipes/flag-bit.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlagListCodeComponent } from './components/flag-list-code/flag-list-code.component';
import { ThesaurusListComponent } from './components/thesaurus-list/thesaurus-list.component';
import { ThesaurusFilterComponent } from './components/thesaurus-filter/thesaurus-filter.component';
import { ThesaurusListCodeComponent } from './components/thesaurus-list-code/thesaurus-list-code.component';

@NgModule({
  declarations: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FacetListCodeComponent,
    FlagBitPipe,
    FlagDefinitionEditorComponent,
    FlagListComponent,
    FlagListCodeComponent,
    ModelLookupComponent,
    PartDefinitionEditorComponent,
    PartInfoComponent,
    ScreenGalleryComponent,
    ThesaurusListComponent,
    ThesaurusFilterComponent,
    ThesaurusListCodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxMatColorPickerModule,
    NgJsonEditorModule,
    GalleryModule,
    MarkdownModule.forChild(),
    CadmusMaterialModule,
    CadmusProfileCoreModule,
    CadmusShowUiModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  exports: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FacetListCodeComponent,
    FlagDefinitionEditorComponent,
    FlagListComponent,
    FlagListCodeComponent,
    ModelLookupComponent,
    PartDefinitionEditorComponent,
    PartInfoComponent,
    ScreenGalleryComponent,
    ThesaurusListComponent,
    ThesaurusFilterComponent,
    ThesaurusListCodeComponent,
  ],
})
export class CadmusProfileUiModule {}
