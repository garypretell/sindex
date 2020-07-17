import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefuncionComponent } from './defuncion.component';

describe('DefuncionComponent', () => {
  let component: DefuncionComponent;
  let fixture: ComponentFixture<DefuncionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefuncionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefuncionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
