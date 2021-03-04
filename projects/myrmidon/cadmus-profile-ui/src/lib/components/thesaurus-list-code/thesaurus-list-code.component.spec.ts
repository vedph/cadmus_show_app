import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusListCodeComponent } from './thesaurus-list-code.component';

describe('ThesaurusListCodeComponent', () => {
  let component: ThesaurusListCodeComponent;
  let fixture: ComponentFixture<ThesaurusListCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusListCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusListCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
