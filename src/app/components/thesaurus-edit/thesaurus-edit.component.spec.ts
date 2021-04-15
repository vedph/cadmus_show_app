import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusEditComponent } from './thesaurus-edit.component';

describe('ThesaurusEditComponent', () => {
  let component: ThesaurusEditComponent;
  let fixture: ComponentFixture<ThesaurusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
