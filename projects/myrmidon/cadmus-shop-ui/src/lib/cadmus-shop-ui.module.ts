import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusShowUiModule } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
import { CadmusModelFilterComponent } from './components/cadmus-model-filter/cadmus-model-filter.component';
import { CadmusModelListComponent } from './components/cadmus-model-list/cadmus-model-list.component';

@NgModule({
  declarations: [CadmusModelFilterComponent, CadmusModelListComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusShowUiModule,
  ],
  exports: [CadmusModelFilterComponent, CadmusModelListComponent],
})
export class CadmusShopUiModule {}
