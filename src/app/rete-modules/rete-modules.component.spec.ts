import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteModulesComponent } from './rete-modules.component';

describe('ReteModulesComponent', () => {
  let component: ReteModulesComponent;
  let fixture: ComponentFixture<ReteModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReteModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReteModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
