import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../services/todo.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  todo: Todo[];
  filterString: string;
  data: Todo[];
  userEmail: string;
  constructor(private todoService: TodoService, private authService: AuthenticationService,
    private navCtrl: NavController) { }

  ngOnInit() {
    if (this.authService.userDetails()) {
      this.userEmail = this.authService.userDetails().email;
      this.todoService.getTodos().subscribe(res => {
        this.todo = res;
        this.data = res;
      });
    } else {
      this.navCtrl.navigateBack('');
    }
  }

  filterItem() {
    console.log(this.filterString);
    this.todo = this.data.filter(i => {
      return i.nameItem.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1;
    });
  }

  remove(item) {
    this.todoService.removeTodo(item.id);
  }

  logout(){
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })
  }

}
