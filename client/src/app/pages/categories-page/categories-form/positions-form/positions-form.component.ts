import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css'],
})
export class PositionsFormComponent {
  @ViewChild('modal')
  modalRef!: ElementRef;
  @Input('categoryId') categoryId!: string;
  positions: Position[] = [];
  positionId: string | null | undefined;
  loading = false;
  form!: FormGroup;

  modal!: MaterialInstance;

  constructor(private positionsService: PositionsService) {}

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.minLength(1)])
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe({
      next: (positions) => {
        this.positions = positions;
        this.loading = false;
      },
      error: (error) => {
        //console.log(error.error.message);
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () =>  {
      this.modal.close();
      this.form.reset({name: '', cost: 1});
      this.form.enable();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe({
        next: position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        error: error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        complete: () => {
          completed();
        }
      });
    } else {
      this.positionsService.create(newPosition).subscribe({
        next: position => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        error: error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        complete: () => {
          completed();
        }
      });
    }
  }

  onDeletePosition(event: Event,position: Position) {
    event.stopPropagation();
    const desision = window.confirm(`Удалить позицию ${position.name} ?`);
    if (desision) {
      this.positionsService.delete(position).subscribe({
        next: response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error: error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
      });
    }
  }
}
