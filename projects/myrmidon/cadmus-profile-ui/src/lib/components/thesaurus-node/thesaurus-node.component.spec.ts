import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusNodeComponent } from './thesaurus-node.component';

describe('ThesaurusNodeComponent', () => {
  let component: ThesaurusNodeComponent;
  let fixture: ComponentFixture<ThesaurusNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
