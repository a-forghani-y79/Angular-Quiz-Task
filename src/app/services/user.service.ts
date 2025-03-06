import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private cachedUsers: Map<number, User[]> = new Map(); // ✅ Caching paginated results
  private cachedSingleUsers: Map<number, User> = new Map(); // ✅ Caching single users
  private totalUsers: number | null = null; // ✅ Store total users count

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated users from the API or cache.
   */
  getUsers(page: number, pageSize: number | null): Observable<{ users: User[]; total: number }> {
    if (this.cachedUsers.has(page)) {
      console.log(`Returning cached data for page ${page}`);
      return of({ users: this.cachedUsers.get(page)!, total: this.totalUsers! });
    }

    return this.http.get<{ data: User[]; total: number }>(`${this.apiUrl}?page=${page}&per_page=${pageSize}`).pipe(
      tap(response => {
        this.cachedUsers.set(page, response.data);
        this.totalUsers = response.total;
      }),
      map(response => ({
        users: response.data,
        total: response.total
      })),
      shareReplay(1) // ✅ Cache the response for reuse
    );
  }

  /**
   * Fetch a single user by ID, using cache if available.
   */
  getUserById(id: number): Observable<User> {
    if (this.cachedSingleUsers.has(id)) {
      console.log(`Returning cached user data for ID ${id}`);
      return of(this.cachedSingleUsers.get(id)!);
    }

    return this.http.get<{ data: User }>(`${this.apiUrl}/${id}`).pipe(
      tap(response => this.cachedSingleUsers.set(id, response.data)), // ✅ Store in cache
      map(response => response.data),
      shareReplay(1) // ✅ Cache the response
    );
  }
}
