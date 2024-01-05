import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {


  private _message: string = '';

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
    console.log('El mensaje ha cambiado:', value);
  }

  readonly welcome = 'Hi LABS';
  tasks = signal([
    'install Angular CLI',
    'Create Project',
    'Create component',
    'Create service'
  ]);
  valueInput = 'Holas perras';
  name = signal('Felipe');
  age = 33;
  colorControl = new FormControl();
  nameControl = new FormControl(50, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });
  
  clickHandler() {
    alert('Hi Felipe');
  }

  dobleClickHandler() {
    alert('Hi Doble click');
  }

  keydownHandler(event : KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.valueInput = input.value;
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value)
  }

  changeMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message = input.value;
  }
}
