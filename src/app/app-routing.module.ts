import { Routes } from '@angular/router';


export const rootRouterConfig: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/quote/quote.module').then(m => m.QuoteModule),
  },
  {
    path: 'quote-compare',
    loadChildren: () => import('./views/quotecompare/quotecompare.module').then(m => m.QuotecompareModule),
  },
  {
    path: 'proposal',
    loadChildren: () => import('./views/proposal/proposal.module').then(m => m.ProposalModule),
  },
  {
    path: 'proposal-confirmation',
    loadChildren: () => import('./views/proposalconfirmation/proposalconfirmation.module').then(m => m.ProposalconfirmationModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'payment',
    loadChildren: () => import('./views/payment/payment.module').then(m => m.PaymentModule),
  },
 
  {
    path: '**',
    redirectTo: 'auth/404'
  }
];