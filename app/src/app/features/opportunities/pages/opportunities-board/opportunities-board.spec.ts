import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesBoard } from './opportunities-board';

describe('OpportunitiesBoard', () => {
  let component: OpportunitiesBoard;
  let fixture: ComponentFixture<OpportunitiesBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitiesBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
