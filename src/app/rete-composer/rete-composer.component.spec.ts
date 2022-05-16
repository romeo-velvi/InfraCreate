import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteComposerComponent } from './rete-composer.component';

describe('ReteModulesComponent', () => {
  let component: ReteComposerComponent;
  let fixture: ComponentFixture<ReteComposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReteComposerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReteComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
