import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { User } from 'firebase';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-usuario-parroquia',
  templateUrl: './usuario-parroquia.component.html',
  styleUrls: ['./usuario-parroquia.component.css']
})
export class UsuarioParroquiaComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('editModal') editModal: ElementRef;
  usuariotoEdit: any = {};

  subscriber: any;
  editor: any;
  admin: any;
  super: any;

  midiocesis: any;
  miparroquia: any;

  usuarios$: Observable<any>;
  searchObject: any = {};
  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public auth: AuthService,
  ) { }


  sub;
  ngOnInit() {
    this.sub = this.activatedroute.data.subscribe((data: { usuariosParroquia: Observable<any[]> }) => {
      this.usuarios$ = data.usuariosParroquia;
    });

    this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
    }), takeUntil(this.unsubscribe$)).subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  deleteUsusario(usuario) {
    Swal.fire({
      title: 'Esta seguro de eliminar este usuario?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`usuarios/${usuario.id}`).delete();
        Swal.fire(
          'Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
      }
    });
  }

  editUsuario(usuario) {
    this.afs.doc(`usuarios/${usuario.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.usuariotoEdit = usuario.id;
      this.subscriber = data.roles.subscriber;
      this.editor = data.roles.editor;
      this.admin = data.roles.admin;
      this.super = data.roles.super;
    });
    jQuery(this.editModal.nativeElement).modal('show');
  }

  async updateUsuario() {
    const roles: any = {
      roles: {
        admin: this.admin,
        editor: this.editor,
        subscriber: this.subscriber,
        super: this.super
      }
    };
    await this.afs.doc(`usuarios/${this.usuariotoEdit}`).set(roles, { merge: true });
    jQuery(this.editModal.nativeElement).modal('hide');
  }

  goReporte(usuario) {
     this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'usuarios', usuario.id]);
  }
}
