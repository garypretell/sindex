import { Component, OnInit, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BautismoComponent } from '../bautismo/bautismo.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { DefuncionComponent } from '../defuncion/defuncion.component';
import { MatrimonioComponent } from '../matrimonio/matrimonio.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit, OnDestroy {
  documento: any;
  constructor(
    private activatedroute: ActivatedRoute
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.documento = params.get('doc');
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
