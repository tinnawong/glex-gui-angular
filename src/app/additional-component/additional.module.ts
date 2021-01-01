import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './additional.routing';

import { StorageWord } from './StorageWord/storageWord.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { WordFrequencyComponent } from './word-frequency/word-frequency.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    ContextMenuModule,
    ColorPickerModule
  ],
  providers: [],
  declarations: [
    StorageWord,
    WordFrequencyComponent
  ]
})
export class MaterialComponentsModule {}
