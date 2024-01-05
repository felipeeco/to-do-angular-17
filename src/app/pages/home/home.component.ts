import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgIf } from '@angular/common';
import { Task, Filters, FilterValues } from '../../models/task.model';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, JsonPipe, NgSwitch, NgSwitchCase, NgSwitchDefault, ReactiveFormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ngOnInit() {
   const storageTasks = localStorage.getItem('tasks');
   if(storageTasks) {
      const tasks: Task[] = JSON.parse(storageTasks);
      this.tasks.set(tasks);
   }
  }

  constructor() {
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    });
  }

  editingTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(5),
    ]
  });

  filter = signal<Filters>('all');
  filterTwo = signal<FilterValues>(FilterValues.All);
  filterValues = FilterValues;

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ]
  });

  tasks = signal<Task[]>([]);

  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if(filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }

    if(filter === 'completed') {
      return tasks.filter(task => task.completed);
    }

    return tasks;
  });

  taskByFilterTwo = computed(() => {
    const filter = this.filterTwo();
    const tasks = this.tasks();
  
    const filterMap : Record<FilterValues, () => Task[]> = {
      [FilterValues.Completed]: () => tasks.filter((task) => task.completed),
      [FilterValues.Pending]: () => tasks.filter((task) => !task.completed),
      [FilterValues.All]: () => tasks
    }
  
    return filterMap[filter]();
  });

  activeEditingTask(position : number) {
    this.tasks.update(tasksForUpdate => {
      return tasksForUpdate.map((task, index) => {
        return {
          ...task,
          editing: position === index ? true : false
        }
      })
    })
  }

  changeFilter(filter : Filters) {
    this.filter.set(filter);
  }

  changeFilterTwo(filter : FilterValues) {
    this.filterTwo.set(filter);
  }

  changeHandler() {
    if(this.newTaskControl.valid) {
      const newTask = this.createTask(this.newTaskControl.value)
      this.tasks.update(tasks => [...tasks, newTask])
      this.newTaskControl.setValue('')
    }
    
  }

  createTask(title : string): Task {
    return {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      editing: false
    }
  }

  editTask(position : number) {

    const inputVaue = this.editingTaskControl.value.trim();
    
    inputVaue !== '' &&
    this.editingTaskControl.valid && 
    this.tasks.update(tasksForUpdate => {
      return tasksForUpdate.map((task, index) => {
        return {
          ...task,
          editing: false,
          title: position === index ? inputVaue : task.title
        }
      })
    });

    this.editingTaskControl.setValue('');
  }

  deleteTask(index: number) {
    this.tasks.update(tasks => {
      return tasks.filter((task, indexTask) => indexTask !== index);
    });
  }

  updateTask(position: number) {
    this.tasks.update(tasksForUpdate => {
      return tasksForUpdate.map((task, index) => {
        
        if(position === index) {
          return {...task, completed: !task.completed}
        }

        return task
      });
    });
  }
}
