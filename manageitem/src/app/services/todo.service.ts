import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Todo {
  // task: string;
  // priority: number;
  nameItem: string;
  note: string;
  createAt: number;
  updateAt: number;
  imageUrl: string;
  imageName: string;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private todoCollection: AngularFirestoreCollection<Todo>;
  private todo: Observable<Todo[]>;
  constructor(db: AngularFirestore) { 
    this.todoCollection = db.collection<Todo>('todo', ref => ref.orderBy('createAt'));
    this.todo = this.todoCollection.snapshotChanges().pipe(
      map(actions =>{
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id,...data};
        });
      })
    );
  }

  getTodos() {
    return this.todo;
  }

  getTodo(id: string){
    return this.todoCollection.doc<Todo>(id).valueChanges();
  }

  updateTodo(todo: Todo, id: string){
    return this.todoCollection.doc(id).update(todo);
  }

  addTodo(todo: Todo){
    return this.todoCollection.add(todo);
  }

  removeTodo(id){
    return this.todoCollection.doc(id).delete();
  }

}
