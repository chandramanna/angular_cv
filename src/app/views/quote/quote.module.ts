import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteinputComponent } from './quoteinput/quoteinput.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { TooltipDirective } from '../../share/tooltip.directive';

@NgModule({
  declarations: [QuoteinputComponent,TooltipDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(QuoteRoutingModule),
    Select2Module,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class QuoteModule { }
