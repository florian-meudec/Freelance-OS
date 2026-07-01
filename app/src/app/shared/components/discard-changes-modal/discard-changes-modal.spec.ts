import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardChangesModal } from './discard-changes-modal';

describe('DiscardChangeModal', () => {
  let component: DiscardChangesModal;
  let fixture: ComponentFixture<DiscardChangesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscardChangesModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscardChangesModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
