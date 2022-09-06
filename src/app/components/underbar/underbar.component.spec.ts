import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderbarComponent } from './underbar.component';

describe('UnderbarComponent', () => {
  let component: UnderbarComponent;
  let fixture: ComponentFixture<UnderbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
