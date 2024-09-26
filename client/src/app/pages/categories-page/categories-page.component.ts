import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, startWith } from 'rxjs/operators';
import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css'],
})
export class CategoriesPageComponent implements OnInit {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  filteredCategories$!: Observable<Category[]>;
  searchControl = new FormControl('');

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.fetchCategories();

    this.filteredCategories$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => this.filterCategories(searchTerm ?? ''))
    );
  }

  fetchCategories() {
    this.categoriesService.fetch().subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
      error: (error) => console.error('Failed to fetch categories', error),
    });
  }

  filterCategories(searchTerm: string): Observable<Category[]> {
    return this.categories$.pipe(
      map(categories =>
        categories.filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  editCategory(category: Category) {
    // Implement your logic for editing a category
    console.log('Editing category:', category);
  }

  deleteCategory(category: Category) {
    if (!category._id) {
      console.error('Category ID is undefined');
      return;
    }
    const confirmation = window.confirm(`Are you sure you want to delete ${category.name}?`);
    if (!confirmation) {
      return;
    }
    this.categoriesService.delete(category._id).subscribe({
      next: () => {
        console.log('Category deleted successfully');
        this.fetchCategories(); // Refresh the categories list
      },
      error: (error) => console.error('There was an error deleting the category', error),
    });
  }
}
