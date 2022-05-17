import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteTheaterComposerComponent } from './rete-theater-composer.component';

describe('ReteModulesComponent', () => {
  let component: ReteTheaterComposerComponent;
  let fixture: ComponentFixture<ReteTheaterComposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReteTheaterComposerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReteTheaterComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
