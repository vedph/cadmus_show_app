import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusShowUiModule } from '@myrmidon/cadmus-show-ui';
import { ModelFilterComponent } from './components/model-filter/model-filter.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CadmusProfileUiModule } from '@myrmidon/cadmus-profile-ui';

@NgModule({
  declarations: [ModelFilterComponent, ModelListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    CadmusMaterialModule,
    CadmusProfileUiModule,
    CadmusShowUiModule,
  ],
  exports: [ModelFilterComponent, ModelListComponent],
})
export class CadmusShopUiModule {}
