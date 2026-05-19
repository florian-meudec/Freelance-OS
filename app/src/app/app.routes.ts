import { Routes } from '@angular/router';
import { OpportunitiesBoard } from './features/opportunities/pages/opportunities-board/opportunities-board';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'opportunities',
    pathMatch: 'full',
  },
  {
    path: 'opportunities',
    component: OpportunitiesBoard,
  },
];
