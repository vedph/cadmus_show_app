import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule
  ],
  exports: [
    ConfirmDialogComponent,
    SafeHtmlPipe
  ],
})
export class CadmusShowUiModule {}
