import { Routes } from '@angular/router';
import {StorageWord} from './StorageWord/storageWord.component'
import { WordFrequencyComponent } from './word-frequency/word-frequency.component';
import { from } from 'rxjs';

export const MaterialRoutes: Routes = [
  {
    path: 'clipboard',
    component: StorageWord
  },
  {
    path: 'word-frequency',
    component: WordFrequencyComponent
  },
];
