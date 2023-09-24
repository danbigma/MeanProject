import { Observable } from 'rxjs';
import { CategoriesService } from './../../shared/services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {

  categories$: Observable<Category[]>;

  constructor(private categoriesService: CategoriesService){
    this.categories$ = this.categoriesService.fetch();
  }

  ngOnInit() {}

}
