import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { BautismoComponent } from '../bautismo/bautismo.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { DefuncionComponent } from '../defuncion/defuncion.component';
import { MatrimonioComponent } from '../matrimonio/matrimonio.component';

@Component({
  selector: 'app-plantilla-general',
  templateUrl: './plantilla-general.component.html',
  styleUrls: ['./plantilla-general.component.css']
})
export class PlantillaGeneralComponent implements OnInit {
  @ViewChild('figureContainer', {read: ViewContainerRef}) figureContainer;
  documento: any;
  activeTab = 0;
  tabs = [
    {
      title: 'BAUTISMO',
      component: BautismoComponent
    },
    {
      title: 'CONFIRMACION',
      component: ConfirmacionComponent
    },
    {
      title: 'DEFUNCION',
      component: DefuncionComponent
    },
    {
      title: 'MATRIMONIO',
      component: MatrimonioComponent
    }
  ];
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
  }

  async changeTab(pos) {
    this.activeTab = pos;
    this.viewContainerRef.clear();
    this.figureContainer.clear();
    const factory = await this.componentFactoryResolver.resolveComponentFactory(this.tabs[pos].component as any);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

}
