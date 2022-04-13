import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualEditorModuleComponent } from './visual-editor-module.component';

describe('VisualEditorModuleComponent', () => {
  let component: VisualEditorModuleComponent;
  let fixture: ComponentFixture<VisualEditorModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualEditorModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualEditorModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
