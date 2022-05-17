import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteModuleComposerComponent } from './rete-module-composer.component';

describe('ReteModulesComponent', () => {
  let component: ReteModuleComposerComponent;
  let fixture: ComponentFixture<ReteModuleComposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReteModuleComposerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReteModuleComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
