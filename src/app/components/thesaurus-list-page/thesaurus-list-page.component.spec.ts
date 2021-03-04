import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusListPageComponent } from './thesaurus-list-page.component';

describe('ThesaurusListPageComponent', () => {
  let component: ThesaurusListPageComponent;
  let fixture: ComponentFixture<ThesaurusListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
