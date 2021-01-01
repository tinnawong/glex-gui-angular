import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageWord } from './storageWord.component';

describe('SearchComponent', () => {
  let component: StorageWord;
  let fixture: ComponentFixture<StorageWord>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageWord ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageWord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
