import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ShotGalleryComponent } from './components/shot-gallery/shot-gallery.component';
import { CadmusShopCoreModule } from '@myrmidon/cadmus-shop-core';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    SafeHtmlPipe,
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
    ConfirmDialogComponent,
    SafeHtmlPipe,
    ShotGalleryComponent,
  ],
})
export class CadmusShowUiModule {}
