import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent as SegmentComponent } from './segment.component';
import { DashboardRoutes } from './segment.routing';
import { ChartistModule } from 'ng-chartist';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    FormsModule,
    ColorPickerModule,
    ContextMenuModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [SegmentComponent,]
})
export class DashboardModule {}
