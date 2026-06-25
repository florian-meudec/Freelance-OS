import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextAction } from './next-action-card';

describe('NextAction', () => {
  let component: NextAction;
  let fixture: ComponentFixture<NextAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextAction],
    }).compileComponents();

    fixture = TestBed.createComponent(NextAction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
