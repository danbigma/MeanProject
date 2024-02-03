import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrentUser } from '../../interfaces';
import { RoleService } from '../../services/role.service';
import { Subject, debounceTime } from 'rxjs';

interface Column {
  headerKey: string;
  field: string;
  formatter?: (value: any) => string;
  conditionalClass?: boolean;
}

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.css'],
})
export class GenericListComponent {
  currentUser: CurrentUser = this.roleService.getCurrentUser();
  @Input() titleKey!: string;
  @Input() newItemRoute!: string;
  @Input() columns!: Column[];
  @Input() items!: any[];

  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  private searchTerms = new Subject<string>();
  searchTerm: string = ''; // Término de búsqueda

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.searchTerms
      .pipe(
        debounceTime(300) // Ajusta el tiempo según sea necesario
      )
      .subscribe((term) => (this.searchTerm = term));
  }

  search(event: Event): void {
    const target = event.target as HTMLInputElement; // Aserción de tipo aquí
    const value = target.value;
    this.searchTerms.next(value); // Ahora puedes usar 'value' de forma segura
  }

  isAdmin(): boolean {
    return this.currentUser && this.roleService.isAdmin(this.currentUser);
  }

  get filteredItems() {
    return this.items.filter((item) => {
      // Aquí asumimos que quieres buscar en todas las propiedades del objeto.
      // Puedes ajustar esto para buscar en campos específicos.
      return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  getConditionalClass(item: any, field: string): string {
    const value = item[field];
    switch (value) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Under Maintenance':
        return 'status-maintenance';
      default:
        return '';
    }
  }
}
