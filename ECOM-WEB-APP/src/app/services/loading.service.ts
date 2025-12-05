import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Loading Service
 * Manages global loading state for HTTP requests
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Show loading indicator
   */
  show(): void {
    this.loadingSubject.next(true);
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.loadingSubject.next(false);
  }
}

