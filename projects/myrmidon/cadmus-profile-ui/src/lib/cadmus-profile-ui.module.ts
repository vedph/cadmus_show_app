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

@NgModule({
  declarations: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FacetListCodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxMatColorPickerModule,
    NgJsonEditorModule,
    CadmusMaterialModule,
    CadmusProfileCoreModule,
    CadmusShowUiModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  exports: [
    FacetViewComponent,
    FacetMetadataEditorComponent,
    FacetListComponent,
    FacetListCodeComponent
  ],
})
export class CadmusProfileUiModule {}
