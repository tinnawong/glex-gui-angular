import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideOutputComponent } from './side-output.component';

describe('SideOutputComponent', () => {
  let component: SideOutputComponent;
  let fixture: ComponentFixture<SideOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
