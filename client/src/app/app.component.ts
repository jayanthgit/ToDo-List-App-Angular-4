import { Component, OnInit } from '@angular/core';
import { Headers, RequestOptions , Http } from '@angular/http'
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todoItems = null;
  todoItemDescription = '';
  newTodoItemDescription = '';

  constructor(private http: Http) {
    console.log('inside AppComponent constructor');
  }

  ngOnInit(): void {
    this.getTodoItems();
  }

  getTodoItems() {
    this.http.get('http://localhost:3000/allTodoItems')
    .map(res => res.json())
    .subscribe(data => {
      data.todoStore.forEach(element => {
        element.isEditable = false;
      });
      this.todoItems = data.todoStore;
    });
  }

  addTodoItem(description) {
    console.log(`Entered todoitem name is ${description}`);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let todoItem = { 'todoItem': this.todoItemDescription, "time": new Date() };
    this.http.post(`http://localhost:3000/addTodoItems/`, todoItem, options)
          .map((data) => {
            console.log(data);
          }).subscribe((data) => {
            this.getTodoItems();
          });
    this.todoItemDescription = '';
  }

  editTodoItem(item) {
    item.isEditable = true;
  }

  editTodoItemComplete(item) {
    console.log(`editTodoItemComplete called: ${JSON.stringify(item)}`);
    item.isEditable = false;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let todoItemObj = { 'id': item.id, 'description': item.description };
    this.http.post(`http://localhost:3000/editTodoItems/`, todoItemObj, options)
          .map((data) => {
            console.log(data);
          }).subscribe((data) => {
            this.getTodoItems();
          });
  }

  deleteTodoItem(item) {
    console.log(`deleteTodoItem called: ${JSON.stringify(item)}`);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let todoItemObj = { 'id': item.id };
    this.http.post(`http://localhost:3000/deleteTodoItems/`, todoItemObj, options)
          .map((data) => {
            console.log(data);
          }).subscribe((data) => {
            this.getTodoItems();
          });
  }
}
