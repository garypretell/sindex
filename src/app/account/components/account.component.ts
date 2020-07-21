import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  checkBoxValue: boolean;
  validarCodigos: boolean;
  diocesis: any;
  diocesisN: any;
  parroquiaN: any;
  parroquia: any;
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public auth: AuthService,
    public afAuth: AngularFireAuth,
  ) {
    this.checkBoxValue = false;
    this.validarCodigos = false;
  }

  ngOnInit() {
  }

  verificarParroquia() {
    if (this.parroquia && this.diocesis) {
      this.afs.firestore.doc(`Parroquias/${this.parroquia}`).get()
        .then(async docSnapshot => {
          if (docSnapshot.exists) {
            const datos = docSnapshot.data();
            this.parroquiaN = datos.nombre;
            if (datos.diocesis === this.diocesis) {
              await this.afs.firestore.doc(`Diocesis/${this.diocesis}`).get().
              then(snapshot => {
                const data = snapshot.data();
                this.diocesisN = data.nombre;
                this.validarCodigos = true;
              });
            }
            else {
              this.validarCodigos = false;
            }
          } else {
            this.validarCodigos = false;
          }
        });
    } else {
      this.validarCodigos = false;
    }

  }

  signInWithGoogle() {
    this.auth.signInWithGoogle().then(() => {
      this.postSignIn();
    });
  }

  postSignIn(): void {
    this.router.navigate(['/Home']);
  }

  createWithGoogle() {
    const diocesis: any = {
      id: this.diocesis,
      nombre: this.diocesisN
    };

    const parroquia: any = {
      id: this.parroquia,
      nombre: this.parroquiaN
    };
    this.auth.createWithGoogle(diocesis, parroquia).then(() => this.postSignIn());
  }

}
