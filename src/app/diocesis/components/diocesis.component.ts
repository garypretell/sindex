import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { DiocesisService } from '../diocesis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Diocesis } from '../models/diocesis';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/take';
import { map, switchMap, combineLatest, takeUntil, take } from 'rxjs/operators';
declare var jQuery: any;

@Component({
  selector: 'app-diocesis',
  templateUrl: './diocesis.component.html',
  styleUrls: ['./diocesis.component.css']
})
export class DiocesisComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild('myModalEdit') myModalEdit: ElementRef;
  searchObject: any = { nombre: '' };
  limpiar: string;
  p: 1;
  public addDiocesisForm: FormGroup;
  public editDiocesisForm: FormGroup;
  departamentos: any;
  diocesisEditObj: any;
  editar: boolean;

  single: any[];
  view: any[] = [800, 400];

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  constructor(
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public diocesisService: DiocesisService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.diocesisEditObj = {};
    this.editar = false;
    this.single = [
      {
        name: 'Germany',
        value: 8940000
      },
      {
        name: 'USA',
        value: 5000000
      },
      {
        name: 'France',
        value: 7200000
      },
        {
        name: 'UK',
        value: 6200000
      }
    ];
  }

  ngOnInit() {

    this.addDiocesisForm = this.formBuilder.group({
      nombre:  ['', [Validators.required ]],
      departamento:  ['', [Validators.required ]],
      estado:  [''],
      total_registros:  [''],
      transferencia: [''],
      secretarias: [''],
      parroquias: [''],
      createdAt: [''],
    });

    this.diocesisService.getDepartamentos().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.departamentos = data.filter(f => f.provincia === '00' && f.distrito === '00');
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cleanSearch() {
    this.searchObject.nombre = '';
  }

  showModal() {
    jQuery(this.myModal.nativeElement).modal('show');
  }

  enableEditing(event, diocesis) {
    jQuery(this.myModalEdit.nativeElement).modal('show');
    this.editar = true;
    this.diocesisEditObj = diocesis;
  }

  addDiocesis() {
    this.afs.firestore.doc(`Diocesis/${(this.addDiocesisForm.value.nombre).replace(/ /g, '')}`).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        alert('Esta Diocesis ya existe!');
        this.addDiocesisForm.reset();
      } else {
        this.addDiocesisForm.value.transferencia = false;
        this.addDiocesisForm.value.estado = true;
        this.addDiocesisForm.value.total_registros = 0;
        this.addDiocesisForm.value.secretarias = [];
        this.addDiocesisForm.value.parroquias = [];
        this.addDiocesisForm.value.createdAt = Date.now();
        const diocesis = this.afs.doc(`Diocesis/${(this.addDiocesisForm.value.nombre).replace(/ /g, '')}`);
        diocesis.set(this.addDiocesisForm.value, { merge: true });
        this.addDiocesisForm.reset();
      }
    });
  }

  updateDiocesis() {
    this.diocesisService.actualizarDiocesis(this.diocesisEditObj);
    jQuery(this.myModalEdit.nativeElement).modal('hide');
  }

  deleteDiocesis(diocesis) {
    if (confirm('Esta seguro de eliminar este proyecto?')) {
      this.diocesisService.eliminarDiocesis(diocesis);
    }
  }

  getColor(color) {
    switch (color) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  goParroquias(doc) {
    this.router.navigate(['/Diocesis', doc.id, 'parroquias']);
  }

  trackByFn(index, item) {
    return item.id;
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
