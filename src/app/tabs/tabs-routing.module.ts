import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'dashboard',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'pricing',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'formula',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path:'jute',
        loadChildren: () => import('../Jute/jute.module').then(m => m.JuteModule)
      },
      {
        path: 'canvas',
        loadChildren: () =>  import('../canvas/canvas.module').then(m=> m.CanvasModule)
      },
      {
        path: 'cotton',
        loadChildren: () =>  import('../cotton/cotton.module').then(m=> m.CottonModule)
      },
      {
        path: 'paper',
        loadChildren: () =>  import('../paper/paper.module').then(m=> m.PaperModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
