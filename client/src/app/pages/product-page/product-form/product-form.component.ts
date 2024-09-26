import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  product!: Product;
  loading = false;
  isSubmitting = false;
  isReadOnly = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      category: [null, Validators.required],
      brand: [null, Validators.required],
      description: '',
      variants: this.fb.array([]),
      purchasePrice: [null, [Validators.required, Validators.min(0)]],
      retailPrice: [null, [Validators.required, Validators.min(0)]],
      stock: ['', Validators.required],
      images: this.fb.array([]),
      tags: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isNew = false;
        this.loading = true;
        this.productService.getProductById(id).subscribe((product) => {
          this.product = product;
          this.form.patchValue(product);
          this.loading = false;
        });
      }
    });
  }

  get variants() {
    return this.form.get('variants') as FormArray;
  }

  addVariant() {
    const variantForm = this.fb.group({
      sku: ['', Validators.required],
      attributes: this.fb.array([]),
      stock: ['', Validators.required],
    });

    this.variants.push(variantForm);
  }

  getAttributes(variantIndex: number) {
    return this.variants.at(variantIndex).get('attributes') as FormArray;
  }

  addAttribute(variantIndex: number) {
    const attributeForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.getAttributes(variantIndex).push(attributeForm);
  }

  onSubmit() {
    // if (!this.form.valid) return;
    // this.isSubmitting = true;
    // if (this.isNew) {
    //   this.productService.createProduct(this.form.value).subscribe(
    //     (product) => {
    //       MaterialService.toast(this.translate.instant('product.created'));
    //       this.router.navigate(['/products']);
    //     },
    //     (error) => MaterialService.toast(error.error.message)
    //   );
    // } else {
    //   this.productService
    //     .updateProduct(this.product._id, this.form.value)
    //     .subscribe(
    //       (product) => {
    //         MaterialService.toast(this.translate.instant('product.saved'));
    //         this.router.navigate(['/products']);
    //       },
    //       (error) => MaterialService.toast(error.error.message)
    //     );
    // }
  }

  cancel() {
    this.router.navigate(['/product']);
  }

  // deleteProduct() {
  //   const confirm = window.confirm(
  //     this.translate.instant('product.confirmDelete')
  //   );
  //   if (confirm && this.product._id) {
  //     this.productService.deleteProduct(this.product._id).subscribe(
  //       () => {
  //         MaterialService.toast(this.translate.instant('product.deleted'));
  //         this.router.navigate(['/products']);
  //       },
  //       (error) => MaterialService.toast(error.error.message)
  //     );
  //   }
  // }

  isInvalid(path: string | (string | number)[]): Record<string, boolean> {
    const field = this.form.get(path);
    return { invalid: field != null && field.invalid && field.touched };
  }
}
