import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusLookupComponent } from './thesaurus-lookup.component';

describe('ThesaurusLookupComponent', () => {
  let component: ThesaurusLookupComponent;
  let fixture: ComponentFixture<ThesaurusLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
