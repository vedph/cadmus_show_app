import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { ShotGalleryComponent } from './components/shot-gallery/shot-gallery.component';
import { CadmusShopCoreModule } from '@myrmidon/cadmus-shop-core';
import { RunningCountComponent } from './components/running-count/running-count.component';

@NgModule({
  declarations: [
    RunningCountComponent,
    ShotGalleryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusShopCoreModule
  ],
  exports: [
    RunningCountComponent,
    ShotGalleryComponent,
  ],
})
export class CadmusShowUiModule {}
