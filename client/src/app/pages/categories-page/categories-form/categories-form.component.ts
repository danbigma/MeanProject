import { CategoriesService } from '../../../shared/services/categories.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';
import { response } from 'express';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css'],
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('inputFile') inputRef: ElementRef | undefined;

  form: FormGroup;
  isNew = true;
  image: File | undefined;
  imagePreview: string | undefined = '';

  category!: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (category) => {
          if (category) {
            this.form.patchValue({
              name: category.name,
              quantity: category.quantity
            });
            this.imagePreview = category.imageSrc;
            this.category = category;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
  }

  triggerClick() {
    this.inputRef?.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result?.toString();
    };

    reader.readAsDataURL(file);
  }

  onSumbit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.form.value.quantity, this.image);
    } else {
      const categoryId = this.category._id ? this.category._id : '';
      obs$ = this.categoriesService.update(
        categoryId,
        this.form.value.name,
        this.form.value.quantity,
        this.image
      );
    }

    obs$.subscribe({
      next: (category) => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable();
      },
      error: (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
    });
  }

  deleteCategory() {
    const confirm = window.confirm('Вы уверены что хотите удалить');
    if (confirm && this.category._id) {
      this.categoriesService.delete(this.category._id).subscribe({
        next: (response) => {
          MaterialService.toast(response.message);
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
        },
        complete: () => this.router.navigate(['/categories']),
      });
    }
  }
}
