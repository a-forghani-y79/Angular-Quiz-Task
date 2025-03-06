import {Routes} from '@angular/router';
import {UserTableComponent} from './user-table/user-table.component';
import {UserDetailsComponent} from './user-details/user-details.component';


export const routes: Routes = [
  {path: '', component: UserTableComponent},
  {path: 'user/:id', component: UserDetailsComponent} // ✅ Define user details route
];
