import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { firestore } from 'firebase/app';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModalS') myModalS: ElementRef;
  @ViewChild('myModalEditS') myModalEditS: ElementRef;
  searchObjectS: any = { nombre: '' };
  campotoEditS: any = {};
  public addCampoFormS: FormGroup;

  arrayTemp: any;
  idx: any;

  midiocesis: any;
  miparroquia: any;
  documento: any;
  midocumento: any;
  parroquia: any;
  MANY_ITEMS = 'MANY_ITEMS';
  subs = new Subscription();

  // tslint:disable-next-line:max-line-length
  itemList: any[] = [{nombre: 'usuarioid', tipo: 'numerico'}, {nombre: 'fecharegistro', tipo: 'fecha'}, {nombre: 'N pagina', tipo: 'texto'}];
  tipoArray: any[] = [{id: 1, nombre: 'texto'}, {id: 2, nombre: 'numerico'}, {id: 3, nombre: 'fecha'}, {id: 4, nombre: 'imagen'}];
  campos$: Observable<any>;
  constructor(
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    public activatedroute: ActivatedRoute,
    private dragulaService: DragulaService
  ) {
    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        this.arrayTemp = targetModel;
        const data =  {
          campos : sourceModel
        };
        this.afs.doc(`Plantillas/${this.midocumento}`).set(data, { merge: true });
      })
    );
   }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + params.get('doc').replace(/ /g, '');
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.parroquia = {nombre: data.nombre, id: data.parroquia};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addCampoFormS = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      estado: [''],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  itemListSaveS() {
    const items: any[] = [
             {nombre: 'usuarioid', tipo: 'numerico', estado : 'principal'},
             {nombre: 'fecharegistro', tipo: 'fecha',  estado : 'principal'},
             {nombre: 'N pagina', tipo: 'texto',  estado : 'true'}
     ];
    this.afs.doc(`Plantillas/${this.midocumento}`).set({parroquia: this.miparroquia, campos: items});
   }

   async addCampoS() {
    if ( this.addCampoFormS.value.nombre === 'DIOCESIS' || this.addCampoFormS.value.nombre === 'PARROQUIA' ) {
      this.addCampoFormS.reset();
      return alert('Este campo está reservado por el sistema');
    }
    const data: any = {
      estado: true,
      tipo: this.addCampoFormS.value.tipo,
      nombre: this.addCampoFormS.value.nombre,
    };
    await this.afs.doc(`Plantillas/${this.midocumento}`).update({
      campos: firestore.FieldValue.arrayUnion(data)
    });
    this.addCampoFormS.reset();
   }

   getColor(color) {
    switch (color) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  trackByFn(index, item) {
    return item.id;
  }

  update(e, doc) {
    console.log(doc);
    // this.afs.doc(`Plantillas/${this.midocumento}`).update(doc);
  }

  deleteCampoS(campo) {
    Swal.fire({
      title: 'Esta seguro de eliminar este campo?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Plantillas/${this.midocumento}`).update({
          campos: firestore.FieldValue.arrayRemove (campo)
        });
        Swal.fire(
          'Eliminado!',
          'El campo ha sido eliminado.',
          'success'
        );
      }
    });
  }

  showModalS() {
    jQuery(this.myModalS.nativeElement).modal('show');
  }

  editItem(item) {
    this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges().pipe(map((m: any) => {
      this.arrayTemp = m;
      this.idx = (m.campos).findIndex(x => x.nombre === item.nombre);
      this.campotoEditS = m.campos[this.idx];
    }), takeUntil(this.unsubscribe$)).subscribe();
    jQuery(this.myModalEditS.nativeElement).modal('show');
  }

  goDocumento() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia]);
  }

  updateCampoS(campotoEdit) {
    const miArray = this.arrayTemp.campos;
    miArray[this.idx] = campotoEdit;
    const data =  {
      campos : miArray
    };
    this.afs.doc(`Plantillas/${this.midocumento}`).set(data, { merge: true });
    jQuery(this.myModalEditS.nativeElement).modal('hide');
  }

  updateItem(item){
    const miArray = this.arrayTemp.campos;
    const index = miArray.indexOf(item);
    item.tipo = 'numerico';
    miArray[index] = item;
    console.log(miArray);
  }


}
