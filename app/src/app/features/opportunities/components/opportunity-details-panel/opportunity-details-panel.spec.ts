import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityDetailsPanel } from './opportunity-details-panel';

describe('OpportunityDetailsPanel', () => {
  let component: OpportunityDetailsPanel;
  let fixture: ComponentFixture<OpportunityDetailsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
