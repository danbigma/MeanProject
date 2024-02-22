import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { CurrentUser, Product } from 'src/app/shared/interfaces';
import { RoleService } from 'src/app/shared/services/role.service';
import { ProductService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductComponent implements OnInit {
  currentUser: CurrentUser = this.roleService.getCurrentUser();
  oSub!: Subscription;
  products: Product[] = [];

  loading = false;

  productColumns = [
    { headerKey: 'product.name', field: 'name' },
    { headerKey: 'product.category', field: 'category' },
    { headerKey: 'product.brand', field: 'brand' },
    { headerKey: 'product.price', field: 'retailPrice', formatter: (price: number) => `$${price.toFixed(2)}` },
    { headerKey: 'product.stock', field: 'stock' },
  ];

  constructor(
    private productService: ProductService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.oSub = this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  edit(product: Product) {
    this.router.navigate([`/products/edit/${product._id}`]);
  }

  view(product: Product) {
    this.router.navigate([`/products/view/${product._id}`]);
  }

  // delete(product: Product) {
  //   const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот продукт?');
  //   if (confirmDelete && product._id) {
  //     this.productService.deleteProduct(product._id).subscribe({
  //       next: () => {
  //         MaterialService.toast('Продукт успешно удален');
  //         this.products = this.products.filter((p) => p._id !== product._id);
  //       },
  //       error: (error) => {
  //         MaterialService.toast(error.error.message);
  //       },
  //     });
  //   }
  // }
}
