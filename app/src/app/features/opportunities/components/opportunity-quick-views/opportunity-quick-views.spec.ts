import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityQuickViews } from './opportunity-quick-views';

describe('OpportunityQuickViews', () => {
  let component: OpportunityQuickViews;
  let fixture: ComponentFixture<OpportunityQuickViews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityQuickViews],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityQuickViews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
