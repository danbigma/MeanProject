import {ElementRef} from '@angular/core'

declare var M: { toast: (arg0: { html: string }) => void; FloatingActionButton: { init: (arg0: any) => void }; updateTextFields: () => void; Modal: { init: (arg0: any) => MaterialInstance }; Tooltip: { init: (arg0: any) => MaterialInstance }; Datepicker: { init: (arg0: any, arg1: { format: string; showClearBtn: boolean; onClose: () => void }) => MaterialDatepicker } }

export interface MaterialInstance {
  open(): void
  close(): void
  destroy(): void
}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date
}

export class MaterialService {

  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    });
  }
}