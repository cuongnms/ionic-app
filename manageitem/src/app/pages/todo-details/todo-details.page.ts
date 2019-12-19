import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from 'src/app/services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {
  public myPhoto: any;
  public nameImg: string;
  todo: Todo = {
    nameItem:'',
    createAt: new Date().getTime(),
    note: '',
    updateAt: null,
    imageUrl: '',
    imageName: '',
  }
  todoId = null;
  constructor(private todoService: TodoService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private nav: NavController,
    public alert: AlertController,
    private camera: Camera) {  
      
    }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId) {
      this.loadTodo();
    }
  }

  async loadTodo() {
    const loading = await this.loadingController.create({
      message: 'Loading item...'
    });
    await loading.present();
    this.todoService.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });
  }

  async saveTodo() {
    this.todo.updateAt = new Date().getTime();
    if (this.todo.nameItem !== "" && this.todo.note !== "") {
      this.todo.updateAt = new Date().getTime();
      const loading = await this.loadingController.create({
        message: 'Saving item...'
      });
      await loading.present();
      if (this.todoId) {
        this.todoService.updateTodo(this.todo, this.todoId).then(() => {
          loading.dismiss();
          this.nav.navigateBack('home');
        })
      } else {
        this.todoService.addTodo(this.todo).then(() => {
          loading.dismiss();
          this.nav.navigateBack('home');
        });
      }
    } else {
      this.showAlert("Error", "Task or priority is not inserted");
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })
    await alert.present();
  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadAndGetPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadAndGetPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  removePhoto(): void{
    try {
      const task = storage().ref('Picture/'+this.todo.imageName).delete();
      this.todo.imageUrl='';
    } catch (error) {
      console.log("ERROR -> " + JSON.stringify(error));
    }
    
  }

  private uploadAndGetPhoto(): void {
    this.nameImg = this.generateUUID();
    const task = storage().ref('Picture/'+this.nameImg+'.png').putString(this.myPhoto, 'base64').then(()=>{
      const ref = storage().ref('Picture/'+this.nameImg+'.png').getDownloadURL().then(url =>{
        this.todo.imageUrl = url;
        this.todo.imageName=this.nameImg+'.png';
      });
    });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}
