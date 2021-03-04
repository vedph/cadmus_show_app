import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusListCodePageComponent } from './thesaurus-list-code-page.component';

describe('ThesaurusListCodePageComponent', () => {
  let component: ThesaurusListCodePageComponent;
  let fixture: ComponentFixture<ThesaurusListCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusListCodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusListCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
