import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInputV2Component } from './data-input-v2.component';

describe('DataInputV2Component', () => {
  let component: DataInputV2Component;
  let fixture: ComponentFixture<DataInputV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataInputV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInputV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
