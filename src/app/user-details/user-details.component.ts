import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule, NgOptimizedImage]
})
export class UserDetailsComponent {
  user: User | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(user => {
        this.user = user;
        this.loading = false;
      });
    }
  }

  goBack() {
    this.router.navigate(['/']); // ✅ Navigate back to user list
  }
}
