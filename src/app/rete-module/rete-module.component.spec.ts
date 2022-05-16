import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteModuleComponent } from './rete-module.component';

describe('ReteModulesComponent', () => {
  let component: ReteModuleComponent;
  let fixture: ComponentFixture<ReteModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReteModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReteModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
