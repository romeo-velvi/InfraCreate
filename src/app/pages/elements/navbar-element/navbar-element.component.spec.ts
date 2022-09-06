import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarElementComponent } from './navbar-element.component';

describe('NavbarElementComponent', () => {
  let component: NavbarElementComponent;
  let fixture: ComponentFixture<NavbarElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
