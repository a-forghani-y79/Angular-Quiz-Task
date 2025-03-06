import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user.model';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, NgIf, RouterLink, NgOptimizedImage]
})
export class UserTableComponent implements OnInit{
  users: User[] = [];
  totalRecords: number = 0;
  loading = true;
  selectedUser: User | null = null;
  page = 1;
  pageSize: number = 5;
  first = 0;

  searchId: number | null = null;
  searchError: string = '';
  private searchSubject = new Subject<number>();


  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.loadUsers();
    this.searchSubject.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(id => {
      this.performSearch(id);
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.page, this.pageSize).subscribe(response => {
      this.users = response.users;
      this.totalRecords = response.total;
      this.loading = false;
    });
  }

  loadUsersLazy(event: TableLazyLoadEvent) {
    if (event.first !== undefined && event.rows !== undefined && event.first !== null && event.rows != null) {
      this.first = event.first;
      this.pageSize = event.rows;
      this.page = Math.floor(event.first / event.rows) + 1;
      this.loadUsers();
    }
  }


  onSearchChange() {
    if (this.searchId === null || this.searchId < 1) {
      this.searchError = '';
      return;
    }
    this.searchSubject.next(this.searchId);
  }

  private performSearch(id: number) {
    this.userService.getUserById(id).subscribe({
      next: user => {
        if (user) {
          this.searchError = '';
          this.router.navigate(['/user', user.id]).then(() => {
          });
        } else {
          this.searchError = 'User not found';
        }
      },
      error: () => {
        this.searchError = 'User not found';
      }
    });
  }

}
