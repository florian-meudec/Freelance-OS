import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityFilters } from './opportunity-filters';

describe('OpportunityFilters', () => {
  let component: OpportunityFilters;
  let fixture: ComponentFixture<OpportunityFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
