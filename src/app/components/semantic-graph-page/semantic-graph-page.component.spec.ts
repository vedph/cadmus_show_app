import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticGraphPageComponent } from './semantic-graph-page.component';

describe('SemanticGraphPageComponent', () => {
  let component: SemanticGraphPageComponent;
  let fixture: ComponentFixture<SemanticGraphPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemanticGraphPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticGraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
